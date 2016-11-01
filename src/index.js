
import deepDiff from 'deep-diff';
class ChromeColorLog {
  constructor() {
    this._data = {
      messages: [],
      cstyles: [],
    };
  }

  addStyledMessage(message, color) {
    this._data.messages.push(message);
    this._data.cstyles.push(color);
  }

  red(msg) {
    this.addStyledMessage(msg, 'color:red');
    return this;
  }

  green(msg) {
    this.addStyledMessage(msg, 'color:green');
    return this;
  }

  black(msg) {
    this.addStyledMessage(msg, 'color:black');
    return this;
  }

  concat(colorLog) {
    this._data.messages.concat(colorLog._data.messages);
    this._data.cstyles.concat(colorLog._data.cstyles);
  }

  toPrint() {
    return [
      this.messages.map(msg => `%c${msg}`).join(''),
      ...this.cstyles,
    ];
  }
}
function mapDiffToColorLogObject(change) {
  const colorLog = new ChromeColorLog();
  const path = change.path.join('.');
  if (change.kind === 'PROP') {
    colorLog.black(` \t${path}: ${change.item}`);
  }
  if (change.kind === 'E') {
    colorLog.red(`-\t${path}: ${change.rhs}\n`);
    colorLog.green(`+\t${path}: ${change.lhs}\n`);
  }
  if (change.kind === 'A') {
    colorLog.green(`+\t${path}: ${change.item}\n`);
  }
  if (change.kind === 'D') {
    colorLog.red(`-\t${path}\n`);
  }
  return {
    cLog: colorLog,
    prop: path,
  };
}

export default function consoleDiff(obj1, obj2) {
  const colorLog = new ChromeColorLog();
  const diff = deepDiff(obj1, obj2);

  const mapKeyToDiff = key => ({
    path: key,
    item: obj1[key],
  });

  const clogReducer = (memo, clog) => ({
    ...memo,
    [clog.path]: clog,
  });

  const cloggedProps = Object.keys(obj1).map(mapKeyToDiff).map(mapDiffToColorLogObject);
  const cloggedDiffs = diff.map(mapDiffToColorLogObject);
  const clogObject = cloggedProps.concat(cloggedDiffs).reduce(clogReducer, {});
  const clogList = Object.keys(clogObject).map(key => clogObject[key]);
  const clogStart = colorLog.black('{').black(`\n`);
  const clogEnd = colorLog.black('}').black(`\n`);
  const finalClog = [clogStart, ...clogList, clogEnd].reduce((out, item) => out.concat(item), colorLog);
  console.log(...finalClog.toPrint());
}
