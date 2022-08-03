export enum Attributes {
    body = 'body',
    agility = 'agility',
    reaction = 'reaction',
    strength = 'strength',
    willpower = 'willpower',
    logic = 'logic',
    intuition = 'intuition',
    charisma = 'charisma',
    technomancy = 'technomancy',
    magic = 'magic',
    essence = 'essence',
    luck = 'luck',
}

export type Attribute = {
    value: number
    max: number
}