const emoji = require('node-emoji')

const rightArrow = emoji.get('arrow_right');
const id = emoji.get('id');
const bank = emoji.get('bank');
const user = emoji.get('ghost');

export const successIcon = emoji.get('sunglasses')
export const failureIcon = emoji.get('cry')

export const questions = [
  `${bank} Please enter full path to your Service Account json file\n\n${rightArrow}   `,
  `\n${id} Please enter user's uid you want to update\n\n${rightArrow}    `,
  `\n${user} Please enter user's new role?\n\n${rightArrow}   `,
] as const;
