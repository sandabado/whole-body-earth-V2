export type ElementType="earth"|"fire"|"air"|"water";
export interface DomeConfig{element:ElementType;position:[number,number,number];rotation:[number,number,number];label:string;subtitle:string;bodyColor:string;emissiveColor:string;accentColor:string;glyph:string}
export const DOMES:DomeConfig[]=[
 {element:"earth",position:[-3,0,3],rotation:[0,0,0],label:"EARTH DOME",subtitle:"GROUNDING · CRAFT · PHYSICAL",bodyColor:"#3a2a1a",emissiveColor:"#1a0f00",accentColor:"#84a66e",glyph:"🜃"},
 {element:"fire",position:[-3,0,-3],rotation:[0,0,0],label:"FIRE DOME",subtitle:"IGNITION · PASSION · SPIRIT",bodyColor:"#3a1a0a",emissiveColor:"#2a0500",accentColor:"#84a66e",glyph:"🜂"},
 {element:"air",position:[3,0,-3],rotation:[0,0,0],label:"AIR DOME",subtitle:"EXPANSION · COMMUNICATION · MIND",bodyColor:"#1c2a22",emissiveColor:"#07150d",accentColor:"#84a66e",glyph:"🜁"},
 {element:"water",position:[3,0,3],rotation:[0,0,0],label:"WATER DOME",subtitle:"FLOW · EMOTION · ADAPTATION",bodyColor:"#1a2a24",emissiveColor:"#082019",accentColor:"#84a66e",glyph:"🜄"}
];
export const PATHS=[{from:[-3,0,3],to:[3,0,3],type:"edge"},{from:[3,0,3],to:[3,0,-3],type:"edge"},{from:[3,0,-3],to:[-3,0,-3],type:"edge"},{from:[-3,0,-3],to:[-3,0,3],type:"edge"},{from:[-3,0,3],to:[3,0,-3],type:"diagonal"},{from:[-3,0,-3],to:[3,0,3],type:"diagonal"}] as {from:[number,number,number];to:[number,number,number];type:"edge"|"diagonal"}[];
export const DOME_SPECS={diameter:2.4,height:1.8,segments:16,wallOpacity:.38};
