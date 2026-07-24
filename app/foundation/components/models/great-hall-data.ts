export const NONAGON_SIDES=9,NONAGON_RADIUS=2.5,HALL_HEIGHT=2.8,DOME_RADIUS=2.3;
export const SEATING_RINGS=[{radius:.8,height:0,seats:9},{radius:1.4,height:.15,seats:18},{radius:2,height:.3,seats:27}];
export const PILLARS=Array.from({length:9},(_,i)=>{const a=i/9*Math.PI*2;return{position:[Math.cos(a)*NONAGON_RADIUS,0,Math.sin(a)*NONAGON_RADIUS] as [number,number,number],rotation:[0,-a+Math.PI/2,0] as [number,number,number],index:i}});
export const ACOUSTIC_PANELS=Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2,ring=i<6?1.05:1.65;return{position:[Math.cos(a)*ring,2.45+(i<6?.34:.08),Math.sin(a)*ring] as [number,number,number],rotation:[Math.PI/2.7,0,-a] as [number,number,number],phase:i*.5,index:i}});
export const ANTENNA_SEGMENTS=[{height:.4,radius:.04,y:0},{height:.6,radius:.03,y:.4},{height:.3,radius:.02,y:1}];
