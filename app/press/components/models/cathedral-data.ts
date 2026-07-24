export const DODECA_RADIUS=2.8;
export const STONES=Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return{position:[Math.cos(a)*1.55,0,Math.sin(a)*1.55] as [number,number,number],rotation:[0,-a,0] as [number,number,number],index:i}});
export const FLOOR_CIRCLES=[{x:0,z:0},...Array.from({length:6},(_,i)=>{const a=i/6*Math.PI*2;return{x:Math.cos(a)*.55,z:Math.sin(a)*.55}}),...Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return{x:Math.cos(a)*1.05,z:Math.sin(a)*1.05}})];
export const PROJECTIONS=Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return{position:[Math.cos(a)*1.35,.025,Math.sin(a)*1.35] as [number,number,number],rotation:[-Math.PI/2,0,a] as [number,number,number],index:i}});
