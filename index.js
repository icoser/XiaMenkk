const { default: axios } = require("axios");

const token = "a239f69d-7446-4fe9-b46b-8cbd4db5a867";
var userinfo = {};
//获取开放社区
function getroom() {
  axios
    .post(
      "https://czgy.xmanju.com:5001/api/hsProject/listAll",
      {
        status_EQ: 16,
        sortIndex_0: "desc",
        id_IN: ["7"], //这里填社区ID珩琦公寓是7，园博公寓是6
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json;charset=UTF-8",
          Host: "czgy.xmanju.com:5001",
          Referer:
            "https://servicewechat.com/wx750913032d12da97/83/page-frame.html",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309092b) XWEB/8555",
        },
      }
    )
    .then((res) => {
      getlist(16);
    })
    .catch((err) => {
      console.log(err);
    });
}
//获取房源类型
function getlist(id) {
  axios
    .post(
      "https://czgy.xmanju.com:5001/api/hsHouseType/listAll",
      {
        projectId_EQ: id,//社区ID
        queryWaitSettingFlg: true,
        waitIds: "165,166,154,167,",
        id_IN: ["106", "103", "39", "37", "38"],
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json;charset=UTF-8",
          Host: "czgy.xmanju.com:5001",
          Referer:
            "https://servicewechat.com/wx750913032d12da97/83/page-frame.html",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309092b) XWEB/8555",
        },
      }
    )
    .then((res) => {
      //循环该社区可预约房源
      res.data.data.forEach((element) => {

        var roomname = element.name;
        //这里的三是房源关键字，根据个人情况修改小单间或一室一厅
        if (roomname.search("三") != -1) {
          let arr = {
            type: 0,
            waitTime: 60,//等房天数
            ...userinfo,//个人信息字段，姓名手机号id
            houseTypeName: element.name,//房间名字
            projectName: element.sysWaitSetting.projectName,//社区名字
            projectId: element.projectId,//社区ID
            houseTypeId: element.id,//房源ID
          };
          //执行等房信息提交
          add1(arr);
        }
      });
    })
    .catch((err) => {});
}
//执行抢房信息绑定
function add1(arr) {
  

  axios
    .post(
      "https://czgy.xmanju.com:5001/api/rntWaitRoom/add",
      {
        arr,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json;charset=UTF-8",
          Host: "czgy.xmanju.com:5001",
          Referer:
            "https://servicewechat.com/wx750913032d12da97/83/page-frame.html",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309092b) XWEB/8555",
        },
      }
    )
    .then((res) => {
   add2(res.data.data.id)
    });
}
//根据绑定房型信息提交等房申请
function add2(id) {
  axios.post("https://czgy.xmanju.com:5001/api/sys/operationLog/renter/add",{"tableName":"RNT_Wait_room","dataId":id,"operationDesc":"提交等房申请"}, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json;charset=UTF-8",
            Host: "czgy.xmanju.com:5001",
            Referer:
              "https://servicewechat.com/wx750913032d12da97/83/page-frame.html",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309092b) XWEB/8555",
          },
        }).then(res=>{
          console.log("抢房成功")
        })
}
function info() {
  axios
    .post(
      "https://czgy.xmanju.com:5001/api/auth/tokenInfo",
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json;charset=UTF-8",
          Host: "czgy.xmanju.com:5001",

          Referer:
            "https://servicewechat.com/wx750913032d12da97/83/page-frame.html",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309092b) XWEB/8555",
        },
      }
    )
    .then((res) => {
      userinfo = {
        name: res.data.data.info.realName,
        mobile: res.data.data.info.mobile,
        renterId: res.data.data.info.id,
      };
      console.log(userinfo);
      getroom();
    })
    .catch((err) => {
      console.log(err.data);
    });
}
function main() {
  info();
}
main();
