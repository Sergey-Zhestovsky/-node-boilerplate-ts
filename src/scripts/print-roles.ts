/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import 'colors';
import '../core/helpers/setup-modules';

import Table from 'cli-table3';

import rbac from '@/api/rbac';
import Role from '@/api/rbac/Role';
import RbacController from '@/api/rbac/RbacController';

interface IZone<T = number> {
  left: T;
  right: T;
}

interface IExtendedRole extends Role {
  zone: IZone;
  position: number;
  color: string;
}

interface IIndexedRole {
  iterator: string;
  role: IExtendedRole;
  color: string;
}

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

const printTree = (roleTree: RbacController) => {
  const printLayers = (
    rolesLayer: IExtendedRole[],
    nodeCount: number,
    iterator: number,
    resultIndexes: Record<string, IIndexedRole>
  ) => {
    const symbolsInNode = nodeCount.toString().length;
    let str = '';
    let colorStr = '';
    const nextLayer: IExtendedRole[] = [];

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
      colorStr += `${prefix}(${stringIndex[nodeColor as unknown as number]})`;
      nextLayer.push(...(role.inherits as IExtendedRole[]));
    });

    console.log(colorStr);
    console.log();
    if (nextLayer.length) printLayers(nextLayer, nodeCount, iterator, resultIndexes);
  };

  let nodeCount = 0;
  roleTree.preOrderWalkTrough((role) => nodeCount++);
  const resultIndexes: Record<string, IIndexedRole> = {};

  console.log('============== Role Tree ==============\n'.cyan);
  printLayers([roleTree.root] as IExtendedRole[], nodeCount, 0, resultIndexes);
  console.log('======== Role Tree Description ========\n'.cyan);

  for (const descriptor in resultIndexes) {
    const node = resultIndexes[descriptor];
    console.log(
      `${node.iterator[node.color as unknown as number]}: ${
        descriptor[node.color as unknown as number]
      }`
    );
  }

  console.log();
  return resultIndexes;
};

const printStepTree = (roleTree: IExtendedRole) => {
  const printBranch = (role: IExtendedRole, branch: string) => {
    const isGraphHead = branch.length === 0;
    let branchHead = '';
    let baseBranch = branch;

    if (!isGraphHead) branchHead = role.inherits.length === 0 ? '─ ' : '┬ ';
    console.log(`${branch}${branchHead}${role.descriptor[role.color as unknown as number]}`);

    if (!isGraphHead) {
      const isChildOfLastBranch = branch.endsWith('└─');
      baseBranch = branch.slice(0, -2) + (isChildOfLastBranch ? '  ' : '│ ');
    }

    const nextBranch = `${baseBranch}├─`;
    const lastBranch = `${baseBranch}└─`;

    role.inherits.forEach((child, index) => {
      printBranch(
        child as IExtendedRole,
        role.inherits.length - 1 === index ? lastBranch : nextBranch
      );
    });
  };

  console.log('=========== Role Steps Tree ===========\n'.cyan);
  printBranch(roleTree, '');
  console.log();
};

const printRoleData = (indexedRoles: Record<string, IIndexedRole>) => {
  console.log('=========== Role Table Data ===========\n'.cyan);

  const table = new Table({
    head: ['ID', 'Role', 'Inheritance', 'Actions'],
    colWidths: [6, 25, 35, 75],
    wordWrap: true,
    colAligns: ['right'],
  });

  for (const descriptor in indexedRoles) {
    const { iterator, role, color } = indexedRoles[descriptor];

    const actions = [];
    actions.push(...role.getAllActions().map((a) => a.name));

    const inheritance: string[] = [];
    role.preOrderWalk((r) => {
      if (role !== r) inheritance.push(r.descriptor[r.color as unknown as number]);
    });

    table.push([
      iterator[color as unknown as number],
      role.descriptor[color as unknown as number],
      inheritance.join(', '),
      actions.join(', '),
    ]);
  }

  console.log(table.toString());
};

const printRBAC = () => {
  const walk = (role: IExtendedRole, leftRange: number) => {
    const res = role.inherits.map((childRole) => {
      const childRes = walk(childRole as IExtendedRole, leftRange);
      leftRange = Math.max(childRes.leftRange, leftRange);
      return childRes;
    });

    const zone: IZone<number | null> = { left: null, right: null };

    if (res.length) {
      res.forEach(({ range }) => {
        if (zone.left === null || zone.left > (range.left ?? 0)) zone.left = range.left;
        if (zone.right === null || zone.right < (range.right ?? 0)) zone.right = range.right;
      });
    } else {
      zone.left = leftRange;
      zone.right = leftRange;
      leftRange += 1;
    }

    role.zone = zone as IZone<number>;
    role.position = (role.zone.right + role.zone.left) / 2;
    return { range: zone, leftRange: leftRange };
  };

  if (!rbac.root) {
    console.log('RBAC Root not found'.yellow);
    return;
  }

  walk(rbac.root as IExtendedRole, 0);
  const indexedRoles = printTree(rbac);
  printStepTree(rbac.root as IExtendedRole);
  printRoleData(indexedRoles);
};

export default printRBAC;
