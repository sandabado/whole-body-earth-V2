export const WELL_HEAD_POS:[number,number,number]=[-3.5,.8,-3.5],CISTERN_POS:[number,number,number]=[-2.5,.6,-2.5],POND_POS:[number,number,number]=[.5,.1,1.5],GARDEN_POS:[number,number,number]=[3,0,3];
export const CHANNEL_WAYPOINTS:[number,number,number][]=[CISTERN_POS,[-2,.45,-1.8],[-1.5,.35,-1.2],[-1,.3,-.8],[-.5,.22,-.2],[0,.16,.55],POND_POS];
export const FILTERS=[{position:[-1,.3,-.8] as [number,number,number],medium:"GRAVEL"},{position:[-.5,.22,-.2] as [number,number,number],medium:"CHARCOAL"},{position:[0,.16,.55] as [number,number,number],medium:"SAND"}];
export const IRRIGATION_BRANCHES=[{from:POND_POS,to:[3,.02,2.25] as [number,number,number]},{from:POND_POS,to:[3,0,3] as [number,number,number]},{from:POND_POS,to:[2.5,-.02,3.6] as [number,number,number]}];
export const GREYWATER_PATH:[number,number,number][]=[[2.8,-.04,3.5],[1.7,-.08,3.8],[.6,-.1,3.35],[-.2,-.12,2.7]];
export const RIPARIAN_PLANTS=Array.from({length:18},(_,i)=>{const p=CHANNEL_WAYPOINTS[i%CHANNEL_WAYPOINTS.length];return{position:[p[0]+(i%2?.18:-.18),p[1],p[2]+((i*7)%3-.8)*.12] as [number,number,number],scale:.75+(i%4)*.09}});
