/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

require('colors');

const Table = require('cli-table3');

const rbac = require('../api/rbac');

const COLORS = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'grey',
  'brightRed',
  'brightGreen',
  'brightYellow',
  'brightBlue',
  'brightMagenta',
  'brightCyan',
  'brightWhite',
];

const printTree = (roleTree) => {
  const printLayers = (rolesLayer, nodeCount, iterator, resultIndexes) => {
    const symbolsInNode = nodeCount.toString().length;
    let str = '';
    let colorStr = '';
    const nextLayer = [];

    rolesLayer.forEach((role) => {
      const shiftFromLeft = (symbolsInNode + 1) * (role.position / 0.5);
      const prefix = ' '.repeat(shiftFromLeft - str.length);

      iterator += 1;
      const zeroPrefix = '0'.repeat(symbolsInNode - iterator.toString().length);
      const stringIndex = `${zeroPrefix}${iterator}`;
      const nodeColor = COLORS[iterator % COLORS.length];
      role.color = nodeColor;
      resultIndexes[role.descriptor] = { iterator: stringIndex, role: role, color: nodeColor };

      str += `${prefix}(${stringIndex})`;
      colorStr += `${prefix}(${stringIndex[nodeColor]})`;
      nextLayer.push(...role.inherits);
    });

    console.log(colorStr);
    console.log();
    if (nextLayer.length) printLayers(nextLayer, nodeCount, iterator, resultIndexes);
  };

  let nodeCount = 0;
  roleTree.preOrderWalkTrough((role) => nodeCount++);
  const resultIndexes = {};

  console.log('============== Role Tree ==============\n'.cyan);
  printLayers([roleTree.root], nodeCount, 0, resultIndexes);
  console.log('======== Role Tree Description ========\n'.cyan);

  for (const descriptor in resultIndexes) {
    const node = resultIndexes[descriptor];
    console.log(`${node.iterator[node.color]}: ${descriptor[node.color]}`);
  }

  console.log();
  return resultIndexes;
};

const printStepTree = (roleTree) => {
  const printBranch = (role, branch) => {
    const isGraphHead = branch.length === 0;
    let branchHead = '';
    let baseBranch = branch;

    if (!isGraphHead) branchHead = role.inherits.length === 0 ? '─ ' : '┬ ';
    console.log(`${branch}${branchHead}${role.descriptor[role.color]}`);

    if (!isGraphHead) {
      const isChildOfLastBranch = branch.slice(-2) === '└─';
      baseBranch = branch.slice(0, -2) + (isChildOfLastBranch ? '  ' : '│ ');
    }

    const nextBranch = `${baseBranch}├─`;
    const lastBranch = `${baseBranch}└─`;

    role.inherits.forEach((child, index) => {
      printBranch(child, role.inherits.length - 1 === index ? lastBranch : nextBranch);
    });
  };

  console.log('=========== Role Steps Tree ===========\n'.cyan);
  printBranch(roleTree, '');
  console.log();
};

const printRoleData = (indexedRoles) => {
  console.log('=========== Role Table Data ===========\n'.cyan);

  const table = new Table({
    head: ['ID', 'Role', 'Inheritance', 'Actions'],
    colWidths: [6, 25, 35, 100],
    wordWrap: true,
    colAligns: ['right'],
  });

  for (const descriptor in indexedRoles) {
    const { iterator, role, color } = indexedRoles[descriptor];

    const actions = [];
    actions.push(...role.getAllActions().map((a) => a.name));

    const inheritance = [];
    role.preOrderWalk((r) => {
      if (role !== r) inheritance.push(r.descriptor[r.color]);
    });

    table.push([
      iterator[color],
      role.descriptor[color],
      inheritance.join(', '),
      actions.join(', '),
    ]);
  }

  console.log(table.toString());
};

const printRBAC = () => {
  const walk = (role, leftRange) => {
    const res = role.inherits.map((childRole) => {
      const childRes = walk(childRole, leftRange);
      leftRange = Math.max(childRes.leftRange, leftRange);
      return childRes;
    });

    const zone = { left: null, right: null };

    if (res.length) {
      res.forEach(({ range }) => {
        if (zone.left === null || zone.left > range.left) zone.left = range.left;
        if (zone.left === null || zone.right < range.right) zone.right = range.right;
      });
    } else {
      zone.left = leftRange;
      zone.right = leftRange;
      leftRange += 1;
    }

    role.zone = zone;
    role.position = (zone.right + zone.left) / 2;
    return { range: zone, leftRange: leftRange };
  };

  walk(rbac.root, 0);
  const indexedRoles = printTree(rbac);
  printStepTree(rbac.root);
  printRoleData(indexedRoles);
};

module.exports = printRBAC;
