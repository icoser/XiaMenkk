const { default: axios } = require("axios");
const { api } = require("./config");
const token = "";
var arr = {};
var userinfo = {};
// //获取开放社区，由于我们都知道社区ID了就直接跳过这段了
// function getroom() {
//     post(api.getroom,).then((res) => {
//        console.log(res)
//       });
 
// }
//获取房源类型
function getlist() {
    post(api.getlist,{
        projectId_EQ: 16, //社区ID园博6珩崎7
        queryWaitSettingFlg: true,
        waitIds: "165,166,154,167,",
        id_IN: ["106", "103", "39", "37", "38"],
      }).then(res=>{
        res.data.forEach((element) => {
            var roomname = element.name;
            //这里的三是房源关键字，根据个人情况修改小单间或一室一厅
            if (roomname.search("三") != -1) {
              let arr1 = {
                type: 0,
                waitTime: 60, //等房天数
                ...userinfo, //个人信息字段，姓名手机号id
                houseTypeName: element.name, //房间名字
                projectName: element.sysWaitSetting.projectName, //社区名字
                projectId: element.projectId, //社区ID
                houseTypeId: element.id, //房源ID
              };
                add1(arr1);
            }
          });
      })
  
}
//执行抢房信息绑定
function add1(arr2) {
    post(api.add1, {...arr2} ).then((res) => {
        if (res.data.console.error == -1) return;
        add2(res.data.data.id);
      });
  
}
//根据绑定房型信息提交等房申请
function add2(id) {
    post(api.add2,{ tableName: "RNT_Wait_room", dataId: id, operationDesc: "提交等房申请" }).then((res) => {
        console.log(res);
      });
 
}
async function info() {
  post(api.info, "").then((res) => {
    console.log(res);
    if(res.error != -1)
    {
        getroom();
    }
  });
  
}
function main() {
    info();
}

function post(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://47.102.217.249/api/token", {
        params: {
          token: token,
        },
      })
      .then((res) => {
        axios
          .post(url, data, {
            headers: {
              ...res.data,
              "Content-Type": "application/json;charset=UTF-8",
              Host: "czgy.xmanju.com:5001",

              Referer:
                "https://servicewechat.com/wx750913032d12da97/83/page-frame.html",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309092b) XWEB/8555",
            },
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
  });
}
main();
