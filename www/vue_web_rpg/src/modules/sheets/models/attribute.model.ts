export enum Attributes {
    body = 'body',
    agility = 'agility',
    reaction = 'reaction',
    strength = 'strength',
    willpower = 'willpower',
    logic = 'logic',
    intuition = 'intuition',
    charisma = 'charisma',
    edge = 'edge',
    magic = 'magic',
    essence = 'essence',
    luck = 'luck',
}

export type Attribute = {
    value: number
    max: number
}