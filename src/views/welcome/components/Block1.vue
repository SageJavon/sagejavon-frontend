<template>
  <div class="block1Container" :style="{ height: height + 'px' }">
    <div class="placeholder"></div>
    <div class="blockContent">
      <!-- 内容的头部 -->
      <div class="content-header">
        <div class="infoBox">
          <!-- 文字盒子 -->
          <div class="txtBox">
            <div class="txt1">SageJavon</div>
            <div class="txt2">专注于Java知识的一款课程小助手</div>
            <div class="txt3">我是一段简短的描述</div>
          </div>
          <!-- 按钮盒子 -->
          <div class="btnBox">
            <button class="btn main" @click="useOnline">开始使用SageJavon</button>
            <button class="btn" @click="jumpDoc">使用文档</button>
            <button class="btn" @click="">GitHub</button>
          </div>
        </div>
        <div class="picBox">
          <div class="animation1"></div>
          <div class="animation2"></div>
          <div class="animation3"></div>
          <div class="pic" v-if="!isClickOnline"></div>
          <div class="sign-in-container" v-if="isLogin">
            <NTabs class="custom-tabs" :bar-width="24" type="line" animated="true" default-value="signin" size="large"
              justify-content="space-evenly">
              <!-- 登录 -->
              <NTabPane name="signin" tab="登录">
                <NForm>
                  <NFormItemRow label="1.输入账号">
                    <NInput v-model:value="account" type="text" maxlength="40" />
                  </NFormItemRow>
                  <NFormItemRow label="2.验证您的身份">
                    <div class="password-container">
                      <div style="display: flex; flex-direction: row">
                        <NInput v-model:value="verifyCode" type="text" maxlength="6" />
                        <!-- 在按钮旁边显示倒计时信息 -->
                        <NButton :disabled="countdown > 0" @click="verifyCode_signIn()">
                          {{
                            countdown > 0
                              ? `${countdown} 秒后重新获取`
                              : "获取验证码"
                          }}
                        </NButton>
                      </div>
                    </div>
                  </NFormItemRow>
                </NForm>
                <div class="button-container">
                  <button ghost class="cancel-button button" @click="cancel">
                    取消
                  </button>
                  <button class="login-button button" @click="signIn(signInType)">
                    登录
                  </button>
                </div>
              </NTabPane>
            </NTabs>
          </div>
        </div>
      </div>
      <!-- 卡片式特性介绍 -->
      <div class="card-container">
        <div v-for="item in cardContent" :key="item.id" class="card">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
const isLogin = ref(false);
const isClickOnline = ref(false);
const router = useRouter();
const height = ref(0);
const cardContent = [
  {
    id: 1,
    title: "😍启发式辅导",
    desc: "我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述",
  },
  {
    id: 2,
    title: "🙌课程知识询问",
    desc: "我是描述我是描述我是描述我是描述我是描述我是描述",
  },
  {
    id: 3,
    title: "👌代码解释与修复",
    desc: "我是描述我是描述我是描述我是描述我是描述我是描述",
  },
  {
    id: 4,
    title: "😜自适应学习",
    desc: "我是描述我是描述我是描述我是描述我是描述我是描述",
  },
];
import {
  NButton,
  NConfigProvider,
  NForm,
  NFormItemRow,
  NInput,
  NTabPane,
  NTabs,
  useMessage,
} from "naive-ui";
import { signInByVerifyCode } from "./api/signIn/sign_in_by_verifyCode";
import { signInByPassword } from "./api/signIn/sign_in_by_password";
import { sendVerifyCode } from "./api/signIn/send_verify_code";
import { getUserInfo } from "./api/info/get_user_info";
const themeOverrides = {
  common: {
    primaryColor: "#000",
    primaryColorHover: "#000",
  },
};
const message = useMessage();
const account = ref("");
const password = ref("");
const verifyCode = ref("");
const showVerifyCode = ref(false);
const signInType = ref("verifyCode");
const user = ref(null);
console.log(localStorage.getItem("userInfo"));
// 验证码倒计时
// 在setup中定义一个ref用于存储倒计时剩余时间
const countdown = ref(0);

onMounted(() => {
  window.addEventListener("resize", onResize);
  onResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = () => {
  height.value = window.innerHeight;
};

const useOnline = () => {
  if (localStorage.getItem("user-token")) {
    router.push("/chat");
  } else {
    isClickOnline.value = true;
    isLogin.value = true;
  }
};

const jumpDoc = () => {
  router.push("/doc/zh/");
};

// 定义一个函数用于启动倒计时
function startCountdown() {
  countdown.value = 60; // 设置倒计时初始值为60秒
  const timer = setInterval(() => {
    countdown.value--; // 每秒减少一秒
    if (countdown.value <= 0) clearInterval(timer); // 当倒计时结束时清除定时器
  }, 1000);
}
// 监听countdown的变化，当倒计时结束时将showVerifyCode设置为true
watch(countdown, (val) => {
  if (val === 0) showVerifyCode.value = true;
});

function warning(content) {
  message.warning(content, { closabale: true, duration: 3e3 });
}

function error(content) {
  message.error(content, { closabale: true, duration: 3e3 });
}

function success(content) {
  message.success(content, { closabale: true, duration: 3e3 });
}

// 注册事件：检查账号是否合法，发送验证码，注册并登录
async function register() {
  const validateResult = __validateAccount(account.value);
  if (validateResult !== "合法") {
    account.value = "";
    // alert(validateResult)
    warning(validateResult);
    return;
  }

  showVerifyCode.value = true;

  sendVerifyCode(account.value)
    .then((res) => {
      // console.log(res)
      if (res.status === 200) showVerifyCode.value = true;
      //   alert('验证码发送失败，请稍后再试')
      else error("验证码发送失败，请稍后再试");
    })
    .catch(() => {
      // console.log(err)
      // alert('验证码发送失败，请稍后再试')
      error("验证码发送失败，请稍后再试");
    });
}

// 通过验证码注册并登录，将user缓存到localStorage
async function registerVerify() {
  const validateResult = __validateVerifyCode(verifyCode.value);
  if (validateResult !== "合法") {
    verifyCode.value = "";
    // alert(validateResult)
    warning(validateResult);
    return;
  }
  signInByVerifyCode(account.value, verifyCode.value)
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        user.value = res;
        localStorage.setItem("userInfo", JSON.stringify(res));
        // 登录成功，返回首页
        window.location.href = "/";
      } else {
        // alert('验证码错误，请重新输入')
        error("验证码错误，请重新输入");
      }
    })
    .catch(() => {
      //   console.log(err)
      //   alert('验证码错误，请重新输入')
      error("验证码错误，请重新输入");
    })
    .finally(() => {
      verifyCode.value = "";
    });
}

// 修改发送验证码的函数，使其在发送验证码时启动倒计时
async function verifyCode_signIn() {
  const validateResult = __validateAccount(account.value);
  if (validateResult !== "合法") {
    warning(validateResult);
    return;
  }

  sendVerifyCode(account.value)
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        success("验证码发送成功，请注意查收");
        startCountdown(); // 发送验证码成功后启动倒计时
      } else {
        error("您发送的太过频繁，请稍候再试");
      }
    })
    .catch(() => {
      error("验证码发送失败，请稍后再试");
    });
}
// 登录事件：根据登录方式，调用相应的登录函数
async function signIn(type) {
  const validateResult = __validateAccount(account.value);
  if (validateResult !== "合法") {
    account.value = "";
    // alert(validateResult)
    warning(validateResult);
    return;
  }

  let res = null;
  if (type === "password") {
    const validateResult = __validatePassword(password.value);
    if (validateResult !== "合法") {
      password.value = "";
      //   alert(validateResult)
      warning(validateResult);
      return;
    }
    res = signInByPassword(account.value, password.value);
  } else if (type === "verifyCode") {
    const validateResult = __validateVerifyCode(verifyCode.value);
    if (validateResult !== "合法") {
      verifyCode.value = "";
      //   alert(validateResult)
      warning(validateResult);
      return;
    }
    res = signInByVerifyCode(account.value, verifyCode.value);
  }

  res
    .then((res) => {
      console.log(res);
      if (res.userId) {
        user.value = res;
        localStorage.setItem("user-token", res.accessToken);
        localStorage.setItem("user-id", res.userId);
        getUserInfo()
          .then((userInfoRes) => {
            console.log(userInfoRes);
            if (userInfoRes.status === 200) {
              console.log(userInfoRes.data.data);
              // 在这里处理获取到的用户信息
              localStorage.setItem(
                "userInfo",
                JSON.stringify(userInfoRes.data.data)
              );
            }
          })
          .catch((err) => {
            // 在这里处理获取用户信息失败的情况
            console.log(err);
          });
        // 调用 getUserInfo 获取用户信息
        // 登录成功，返回首页
        router.push("/chat");
      } else {
        //   alert(res.msg)
        error(res.msg);
      }
    })
    .catch(() => {
      // console.log(err)
      // alert('登录失败，请稍后再试')
      error("登录失败，请稍后再试");
    });
}

// 账号的合法性检查：邮箱格式
function __validateAccount(account) {
  let res = "";
  if (account === null || account.trim() === "") res = "请输入账号";

  const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/;
  if (pattern.test(account)) res = "合法";
  else res = "账号格式不正确";

  return res;
}

// 密码的合法性检查：密码长度、是否包含数字、是否包含字母、是否包含特殊字符
function __validatePassword(password) {
  let res = "";
  if (password === null || password.trim() === "") res = "请输入密码";

  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[0-9a-zA-Z\W]{8,20}$/;
  if (pattern.test(password)) res = "合法";
  else res = "密码格式不正确";

  return res;
}

// 验证码的合法性检查：6位数字
function __validateVerifyCode(verifyCode) {
  let res = "";
  if (verifyCode === null || verifyCode.trim() === "") res = "请输入验证码";

  const pattern = /^\d{6}$/;
  if (pattern.test(verifyCode)) res = "合法";
  else res = "验证码格式不正确";

  return res;
}

function cancel() {
  account.value = "";
  verifyCode.value = "";

  user.value = null;
  isLogin.value = false;
  isClickOnline.value = false;
}
</script>

<style lang="less" scoped>
.sign-in-container {
  width: 360px;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 4px 4px 24px rgba(0, 0, 0, 0.08);
}

.password-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.button-container {
  position: relative;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  .cancel-button {
    width: 36%;
    border: 1px solid #00000080;
  }

  .login-button {
    width: 60%;
    background-color: #fa6e2d;
    border: 0px;
    color: white;
  }

  .button {
    border-radius: 8px;
    padding: 4px 0;
  }
}

.block1Container {
  background-color: #f0f9fa;
  border-radius: 0 0 0 450px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .placeholder {
    height: 76px;
    width: 100%;
    margin-bottom: 24px;
  }

  .blockContent {
    width: 100%;
    max-width: 1140px;
    padding: 0 32px;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: stretch;

      .infoBox {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .txtBox {
          max-width: 524px;

          .txt1 {
            font-family: "Punctuation SC", "Inter", ui-sans-serif, system-ui, "Noto Sans SC", "Heiti SC", "Microsoft YaHei", "DengXian", sans-serif;
            font-weight: 700;
            line-height: 72px;
            font-size: 56px;
            background: linear-gradient(93.62deg, #F37676 4.09%, #FBCD2C 108.47%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .txt2 {
            letter-spacing: 2px;
            font-family: "Punctuation SC", "Inter", ui-sans-serif, system-ui, "Noto Sans SC", "Heiti SC", "Microsoft YaHei", "DengXian", sans-serif;
            font-weight: 700;
            line-height: 64px;
            font-size: 56px;
            color: #3e3e3e;
          }

          .txt3 {
            font-size: 24px;
            line-height: 36px;
            margin-top: 12px;
            color: #656565;
          }
        }

        .btnBox {
          display: flex;
          margin-top: 24px;
          column-gap: 12px;

          .btn {
            height: 40px;
            padding: 0 24px;
            cursor: pointer;
            letter-spacing: 2%;
            color: #fff;
            background-color: #fa6e2d;
            border: 0px;
            font-weight: 600;
            font-size: 16px;
            border-radius: 22px;
            transition: all 0.2s;
          }

          .btn:not(.main) {
            color: #474747;
            background-color: #00000012;
          }

          .btn:hover {
            background-color: #e3672e;
          }

          .btn:not(.main):hover {
            background-color: #00000020;
          }

        }
      }

      .picBox {
        position: relative;

        .pic {
          width: 320px;
          height: 300px;
          background-image: url("../../../assets/sagejavon.png");
          background-size: cover;
        }

        .animation1 {
          position: absolute;
          right: -50px;
          bottom: 86px;
          width: 38px;
          height: 38px;
          border: 7px solid #f5828b;
          border-radius: 50%;
          animation-name: zoom1;
          animation-duration: 3s;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          box-shadow: 0 12px 50px 0 rgba(0, 0, 0, 0.14);
        }

        .animation2 {
          position: absolute;
          top: -60px;
          right: 60px;
          border-radius: 50%;
          background-color: #1ea59a;
          box-shadow: 0 20px 30px 0 rgba(48, 61, 114, 0.4);
          width: 25px;
          height: 25px;
          animation: spin 2s infinite alternate;
          bottom: 60px;
        }

        .animation3 {
          border-radius: 50%;
          background-color: #25233a;
          box-shadow: 0 20px 30px 0 rgba(245, 130, 139, 0.4);
          position: absolute;
          width: 25px;
          height: 25px;
          bottom: 50px;
          left: 0px;
          animation: spin 3s infinite alternate;
        }
      }
    }

    .card-container {
      width: 100%;
      margin-top: 64px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;

      .card {
        background-color: #ffffffee;
        min-height: 100px;
        border-radius: 12px;
        color: #3e3e3e;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        row-gap: 16px;

        .card-title {
          letter-spacing: 2%;
          color: #222222;
          font-size: 20px;
          font-weight: 600;
        }

        .card-desc {
          color: #808080;
          font-size: 14px;
          line-height: 24px;
        }
      }
    }
  }
}

@keyframes zoom1 {
  0% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1.5);
  }
}

@keyframes spin {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(32px);
  }
}
</style>
