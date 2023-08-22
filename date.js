module.exports=getDate;
function getDate(){
var today=new Date();
const option={
  weekday:"long",
  day:"numeric",
  month:"long",
  year:"numeric"
};
const day=today.toLocaleDateString("en-US",option);
return day;
}