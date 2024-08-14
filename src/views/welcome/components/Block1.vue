<template>
  <div class="block1Container" :style="{ height: height + 'px' }">
    <div class="blockContent">
      <div class="infoBox">
        <div class="blockTitle">SageJavon</div>
        <div class="infoList">
          <p class="infoRow">是一个java课程小助手</p>
          <p class="infoRow">同时也是得力的编程助手</p>
          <p class="infoRow"></p>
        </div>
        <div class="desc">小助手提供以下功能:
          <div>
            <ul style="">
              <li>课程知识询问</li>
              <li>编程启发式辅导</li>
              <li>通用代码问题询问</li>
              <li>代码解释</li>
              <li>代码修复</li>
              <li>自适应学习</li>
              <li>知识图谱</li>
            </ul>
          </div>
        </div>
        <div class="btnBox">
          <NButton class="btn" type="primary" @click="useOnline">在线使用</NButton>
          <NButton type="info" class="btn" @click="jumpDoc">使用文档</NButton>
        </div>
      </div>
      <div class="picBox">
        <div class="animation1"></div>
        <div class="animation2"></div>
        <div class="animation3"></div>
        <div class="pic" v-if="!isClickOnline"></div>
        <div class="sign-in-container" v-if="isLogin">
        <NTabs
          class="custom-tabs" :bar-width="24" type="line" animated="true" default-value="signin"
          size="large" justify-content="space-evenly"
        >
          <!-- 登录 -->
          <NTabPane name="signin" tab="登录">
            <NForm>
              <NFormItemRow label="1.输入账号">
                <NInput v-model:value="account" type="text" maxlength="40" />
              </NFormItemRow>
              <NFormItemRow label="2.验证您的身份">
                <div class="password-container">
                  <NInput
                    v-if="signInType === 'password'" v-model:value="password"
                    show-password-on="click" type="password" maxlength="20"
                  />
                  <div v-else style="display: flex; flex-direction: row;">
                    <NInput v-model:value="verifyCode" type="text" maxlength="6" />
                    <!-- 在按钮旁边显示倒计时信息 -->
                    <NButton :disabled="countdown > 0" @click="verifyCode_signIn()">
                      {{ countdown > 0 ? `${countdown} 秒后重新获取` : '获取验证码' }}
                    </NButton>
                  </div>
                  <div class="help-container">
                    <a href="#">忘记密码?</a>
                    <a
                      href="#"
                      @click="signInType === 'password' ? signInType = 'verifyCode' : signInType = 'password'"
                    >切换至{{
                      signInType
                        === 'password' ? '验证码' : '密码' }}登录</a>
                  </div>
                </div>
              </NFormItemRow>
            </NForm>
            <div class="button-container">
              <NButton ghost class="cancel-button" type="primary" @click="cancel">
                取消
              </NButton>
              <NButton class="login-button" type="primary" @click="signIn(signInType)">
                登录
              </NButton>
            </div>
          </NTabPane>
          <!-- 注册 -->
          <NTabPane v-if="showVerifyCode" name="signup" tab="注册">
            <NForm>
              <NFormItemRow label="输入验证码">
                <NInput v-model:value="verifyCode" type="text" maxlength="6" />
                <button :disabled="countdown > 0" @click="verifyCode_signIn()">
                  {{ countdown > 0 ? `${countdown} 秒后重新获取` : '获取验证码' }}
                </button>
              </NFormItemRow>
            </NForm>
            <div class="button-container">
              <NButton ghost class="cancel-button" type="primary" @click="cancel">
                取消
              </NButton>
              <NButton class="login-button" type="primary" @click="registerVerify">
                注册并登录
              </NButton>
            </div>
          </NTabPane>
          <NTabPane v-else name="signup" tab="注册">
            <NForm>
              <NFormItemRow label="1.输入账号">
                <NInput v-model:value="account" type="text" maxlength="40" />
              </NFormItemRow>
              <!-- <n-form-item-row label="2.输入密码">
                                <n-input show-password-on="click" v-model:value="password" type="password"
                                    maxlength="20" />
                            </n-form-item-row>
                            <n-form-item-row label="3.确认密码">
                                <n-input show-password-on="click" v-model:value="confirmPassword" type="password"
                                    maxlength="20" />
                            </n-form-item-row> -->
            </NForm>
            <div class="button-container">
              <NButton ghost="true" class="cancel-button" type="primary" @click="cancel">
                取消
              </NButton>
              <NButton class="login-button" type="primary" @click="register">
                注册
              </NButton>
            </div>
          </NTabPane>
        </NTabs>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref,watch } from 'vue'
import { useRouter } from 'vue-router'
const isLogin = ref(false)
const  isClickOnline=ref(false)
const router = useRouter()
const height = ref(0)
import { NButton, NConfigProvider, NForm, NFormItemRow, NInput, NTabPane, NTabs, useMessage } from 'naive-ui'
import { signInByVerifyCode } from './api/signIn/sign_in_by_verifyCode'
import { signInByPassword } from './api/signIn/sign_in_by_password'
import { sendVerifyCode } from './api/signIn/send_verify_code'
import { getUserInfo } from './api/info/get_user_info'
const themeOverrides = {
  common: {
    primaryColor: '#000',
    primaryColorHover: '#000',
  },
}
const message = useMessage()
const account = ref('')
const password = ref('')
const verifyCode = ref('')
const showVerifyCode = ref(false)
const signInType = ref('verifyCode')
const user = ref(null)
console.log(localStorage.getItem('userInfo'))
// 验证码倒计时
// 在setup中定义一个ref用于存储倒计时剩余时间
const countdown = ref(0)


onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const onResize = () => {
  height.value = window.innerHeight
}

const useOnline = () => {
  if(localStorage.getItem('user-token')){
    router.push('/chat')
  } else {
    isClickOnline.value=true
    isLogin.value = true
  }
}

const jumpDoc = () => {
  router.push('/doc/zh/')
}

// 定义一个函数用于启动倒计时
function startCountdown() {
  countdown.value = 60 // 设置倒计时初始值为60秒
  const timer = setInterval(() => {
    countdown.value-- // 每秒减少一秒
    if (countdown.value <= 0)
      clearInterval(timer) // 当倒计时结束时清除定时器
  }, 1000)
}
// 监听countdown的变化，当倒计时结束时将showVerifyCode设置为true
watch(countdown, (val) => {
  if (val === 0)
    showVerifyCode.value = true
})

function warning(content) {
  message.warning(content, { closabale: true, duration: 3e3 })
}

function error(content) {
  message.error(content, { closabale: true, duration: 3e3 })
}

function success(content) {
  message.success(content, { closabale: true, duration: 3e3 })
}

// 注册事件：检查账号是否合法，发送验证码，注册并登录
async function register() {
  const validateResult = __validateAccount(account.value)
  if (validateResult !== '合法') {
    account.value = ''
    // alert(validateResult)
    warning(validateResult)
    return
  }

  showVerifyCode.value = true

  sendVerifyCode(account.value).then((res) => {
    // console.log(res)
    if (res.status === 200)
      showVerifyCode.value = true
    else
    //   alert('验证码发送失败，请稍后再试')
      error('验证码发送失败，请稍后再试')
  }).catch(() => {
    // console.log(err)
    // alert('验证码发送失败，请稍后再试')
    error('验证码发送失败，请稍后再试')
  })
}

// 通过验证码注册并登录，将user缓存到localStorage
async function registerVerify() {
  const validateResult = __validateVerifyCode(verifyCode.value)
  if (validateResult !== '合法') {
    verifyCode.value = ''
    // alert(validateResult)
    warning(validateResult)
    return
  }
  signInByVerifyCode(account.value, verifyCode.value)
    .then((res) => {
      console.log(res)
      if (res.status === 200) {
        user.value = res
        localStorage.setItem('userInfo', JSON.stringify(res))
        // 登录成功，返回首页
        window.location.href = '/'
      }
      else {
        // alert('验证码错误，请重新输入')
        error('验证码错误，请重新输入')
      }
    }).catch(() => {
    //   console.log(err)
    //   alert('验证码错误，请重新输入')
      error('验证码错误，请重新输入')
    }).finally(() => {
      verifyCode.value = ''
    })
}

// 修改发送验证码的函数，使其在发送验证码时启动倒计时
async function verifyCode_signIn() {
  const validateResult = __validateAccount(account.value)
  if (validateResult !== '合法') {
    warning(validateResult)
    return
  }

  sendVerifyCode(account.value).then((res) => {
    console.log(res)
    if (res.status === 200) {
      success('验证码发送成功，请注意查收')
      startCountdown() // 发送验证码成功后启动倒计时
    }
    else {
      error('您发送的太过频繁，请稍候再试')
    }
  }).catch(() => {
    error('验证码发送失败，请稍后再试')
  })
}
// 登录事件：根据登录方式，调用相应的登录函数
async function signIn(type) {
  const validateResult = __validateAccount(account.value)
  if (validateResult !== '合法') {
    account.value = ''
    // alert(validateResult)
    warning(validateResult)
    return
  }

  let res = null
  if (type === 'password') {
    const validateResult = __validatePassword(password.value)
    if (validateResult !== '合法') {
      password.value = ''
      //   alert(validateResult)
      warning(validateResult)
      return
    }
    res = signInByPassword(account.value, password.value)
  }
  else if (type === 'verifyCode') {
    const validateResult = __validateVerifyCode(verifyCode.value)
    if (validateResult !== '合法') {
      verifyCode.value = ''
      //   alert(validateResult)
      warning(validateResult)
      return
    }
    res = signInByVerifyCode(account.value, verifyCode.value)
  }

  res.then((res) => {
    console.log(res)
    if (res.userId) {
      user.value = res
      localStorage.setItem('user-token', res.accessToken)
      localStorage.setItem('user-id', res.userId)
      getUserInfo().then((userInfoRes) => {
        console.log(userInfoRes)
        if (userInfoRes.status === 200) {
          console.log(userInfoRes.data.data)
          // 在这里处理获取到的用户信息
          localStorage.setItem('userInfo', JSON.stringify(userInfoRes.data.data))
        }
      }).catch((err) => {
        // 在这里处理获取用户信息失败的情况
        console.log(err)
      })
      // 调用 getUserInfo 获取用户信息
      // 登录成功，返回首页
      router.push('/chat')
    }
    else {
    //   alert(res.msg)
      error(res.msg)
    }
  }).catch(() => {
    // console.log(err)
    // alert('登录失败，请稍后再试')
    error('登录失败，请稍后再试')
  })
}

// 账号的合法性检查：邮箱格式
function __validateAccount(account) {
  let res = ''
  if (account === null || account.trim() === '')
    res = '请输入账号'

  const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/
  if (pattern.test(account))
    res = '合法'
  else
    res = '账号格式不正确'

  return res
}

// 密码的合法性检查：密码长度、是否包含数字、是否包含字母、是否包含特殊字符
function __validatePassword(password) {
  let res = ''
  if (password === null || password.trim() === '')
    res = '请输入密码'

  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[0-9a-zA-Z\W]{8,20}$/
  if (pattern.test(password))
    res = '合法'
  else
    res = '密码格式不正确'

  return res
}

// 验证码的合法性检查：6位数字
function __validateVerifyCode(verifyCode) {
  let res = ''
  if (verifyCode === null || verifyCode.trim() === '')
    res = '请输入验证码'

  const pattern = /^\d{6}$/
  if (pattern.test(verifyCode))
    res = '合法'
  else
    res = '验证码格式不正确'

  return res
}

function cancel() {
  account.value = ''
  password.value = ''
  verifyCode.value = ''
  showVerifyCode.value = false
  signInType.value = 'password'

  user.value = null
  // 返回首页
  window.location.href = '/'
}
</script>

<style lang="less" scoped>
.sign-in-container {
    width: 400px;
    height: 60vh;
    background-color: rgba(255,255,255,0.5);
    padding: 24px;
    border-radius: 12px;
    box-shadow: 4px 4px 24px rgba(0, 0, 0, 0.1);
}

.password-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.help-container {
    color: black;
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
}

.help-container a {
    color: #000;
}

.button-container {
    position: relative;
    bottom: 0px;
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.button-container .cancel-button {
    width: 36%;
}

.button-container .login-button {
    width: 60%;
}
.block1Container {
  background-color: #f0f9fa;
  border-radius: 0 0 0 450px;
  display: flex;
  justify-content: center;
  align-items: center;

  .blockContent {
    width: 100%;
    max-width: 1140px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .infoBox {
      .blockTitle {
        font-size: 16px;
        color: #1e3547;
        margin-bottom: 10px;
      }

      .infoList {
        margin-top: 20px;

        .infoRow {
          font-size: 45px;
          color: #1e3547;
          font-weight: 700;
          margin-bottom: 20px;
        }
      }

      .desc {
        color: #828f99;
        font-size: 20px;
        line-height: 1.5;
      }

      .btnBox {
        display: flex;
        align-items: center;
        margin-top: 20px;

        .btn {
          height: 44px;
          padding: 0 20px;
          line-height: 44px;
          cursor: pointer;
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          border-radius: 5px;
          transition: all 0.5s;
          margin-right: 10px;

          &:hover {
            transform: translateY(-4px);
          }

          &.btn2 {
            background-color: rgb(76, 119, 79);
          }
        }
      }
    }

    .picBox {
      position: relative;
      .pic {
        width: 500px;
        height: 500px;
        background-image: url('../../../assets/sagejavon.png');
        background-size: cover;
      }

      .animation1 {
        width: 38px;
        height: 38px;
        border: 7px solid #f5828b;
        border-radius: 50%;
        position: absolute;
        right: -50px;
        bottom: 86px;
        animation-name: zoom1;
        animation-duration: 3s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        box-shadow: 0 12px 50px 0 rgba(0, 0, 0, 0.14);
      }

      .animation2 {
        border-radius: 50%;
        background-color: #1ea59a;
        box-shadow: 0 20px 30px 0 rgba(48, 61, 114, 0.4);
        position: absolute;
        width: 25px;
        height: 25px;
        top: -60px;
        right: 60px;
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
    transform: translateY(40px);
  }
}
</style>
