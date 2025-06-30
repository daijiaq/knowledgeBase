<template>
  <div class="login-container">
    <div class="background-decoration">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <div class="login-card">
      <div class="card-header">
        <div class="logo-section">
          <div class="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M8 7h8M8 11h8M8 15h6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <h1 class="logo-text">知识库系统</h1>
          <p class="logo-subtitle">让知识更有序，让思维更清晰</p>
        </div>

        <div class="tab-section">
          <div
            class="tab-indicator"
            :style="{ transform: `translateX(${isLogin ? '0' : '100%'})` }"
          ></div>
          <button
            :class="['tab-btn', { active: isLogin }]"
            @click="setLoginMode(true)"
          >
            登录
          </button>
          <button
            :class="['tab-btn', { active: !isLogin }]"
            @click="setLoginMode(false)"
          >
            注册
          </button>
        </div>
      </div>

      <div class="card-body">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="login-form"
        >
          <div class="form-group" v-if="!isLogin">
            <div class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <el-form-item prop="username">
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
                size="large"
                class="custom-input"
              />
            </el-form-item>
          </div>

          <div class="form-group">
            <div class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M12 16v4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M8 20h8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <el-form-item prop="email">
              <el-input
                v-model="formData.email"
                placeholder="请输入邮箱"
                size="large"
                class="custom-input"
              />
            </el-form-item>
          </div>

          <div class="form-group">
            <div class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
                <path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <el-form-item prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                show-password
                size="large"
                class="custom-input"
              />
            </el-form-item>
          </div>

          <div v-if="!isLogin" class="form-group">
            <div class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
                <path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
                size="large"
                class="custom-input"
              />
            </el-form-item>
          </div>

          <div class="form-actions">
            <el-button
              type="primary"
              @click="handleSubmit"
              size="large"
              class="submit-btn"
              :loading="loading"
            >
              <span v-if="!loading">{{ isLogin ? "登录" : "注册" }}</span>
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { userLogin, userRegister } from "../api/user";
import { useUserStore } from "../stores/useUserStore";
const useStore= useUserStore()
const router = useRouter();
const isLogin = ref(true)
const loading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
})

const validatePass = (_rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"))
  } else if (value.length < 6 || value.length > 12) {
    callback(new Error("密码长度应为 6-12 位"));
  } else if (/[\u4e00-\u9fa5]/.test(value)) {
    callback(new Error("密码不能包含中文")) 
  } else {
    if (!isLogin.value && formData.confirmPassword !== "") {
      formRef.value?.validateField("confirmPassword") 
    }
    callback() 
  }
} 

const validatePass2 = (_rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码")) 
  } else if (value !== formData.password) {
    callback(new Error("两次输入密码不一致!")) 
  } else {
    callback() 
  }
} 

const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: ["blur", "change"] },
  ],
  password: [{ required: true, validator: validatePass, trigger: "blur" }],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: "blur" },
  ],
})

const setLoginMode = (mode: boolean) => {
  isLogin.value = mode 
  formRef.value?.resetFields() 
} 

const handleSubmit = async () => {
  if (!formRef.value) return
  loading.value = true

  try {
    await formRef.value.validate()
    if (isLogin.value) {
      // 登录
      const res = await userLogin(formData.email, formData.password)
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", res.data.token || "")
        localStorage.setItem("username", res.data.username || '未知用户')
      }
      useStore.logined = true
      ElMessage.success("登录成功")
      router.replace('/knowledgeBase/KnowledgeBaseMain')
    } else {
      // 注册
      await userRegister(
        formData.username,
        formData.email,
        formData.password
      )
      ElMessage.success("注册成功，请登录")
      isLogin.value = true
    }
  } catch (error: any) {
    // 如果是表单校验错误，则显示具体的校验信息
    if (error && !error.isAxiosError) {
      const errorFields = Object.values(error)
      if (errorFields.length > 0) {
        const firstError: any = errorFields[0]
        if (firstError?.[0]?.message) {
          ElMessage.error(firstError[0].message)
        }
      }
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  // color:black;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .floating-shapes {
      position: relative;
      width: 100%;
      height: 100%;

      .shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 6s ease-in-out infinite;

        &.shape-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        &.shape-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        &.shape-3 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        &.shape-4 {
          width: 100px;
          height: 100px;
          top: 10%;
          right: 25%;
          animation-delay: 1s;
        }
      }
    }
  }

  .login-card {
    width: 480px;
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    position: relative;
    z-index: 1;

    .card-header {
      padding: 48px 48px 32px;
      text-align: center;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.05)
      );

      .logo-section {
        margin-bottom: 32px;

        .logo-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-light)
          );
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);

          svg {
            width: 32px;
            height: 32px;
            color: black;
          }
        }

        .logo-text {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-light)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 8px;
        }

        .logo-subtitle {
          color: var(--text-color-secondary);
          font-size: 16px;
          margin: 0;
          font-weight: 500;
        }
      }

      .tab-section {
        position: relative;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16px;
        padding: 4px;
        display: flex;

        .tab-indicator {
          position: absolute;
          top: 4px;
          left: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: linear-gradient(
            135deg,
            var(--primary-color),
            var(--primary-light)
          );
          border-radius: 12px;
          transition: transform 0.3s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .tab-btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          background: transparent;
          color: var(--text-color-secondary);
          font-weight: 600;
          font-size: 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;

          &.active {
            color:white;
          }
        }
      }
    }

    .card-body {
      padding: 0 48px 48px;

      .login-form {
        .form-group {
          position: relative;
          margin-bottom: 24px;

          .input-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
            color: var(--text-color-light);

            svg {
              width: 20px;
              height: 20px;
            }
          }

          :deep(.el-form-item) {
            margin-bottom: 0;

            .el-form-item__error {
              padding-left: 48px;
            }
          }

          .custom-input {
            :deep(.el-input__wrapper) {
              padding-left: 48px;
              border-radius: 16px;
              border: 2px solid var(--border-color-light);
              box-shadow: none;
              background: rgba(255, 255, 255, 0.8);
              transition: all 0.3s ease;
              height: 56px;

              &:hover {
                border-color: var(--primary-light);
                background: white;
              }

              &.is-focus {
                border-color: var(--primary-color);
                background: white;
                box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
              }

              .el-input__inner {
                font-size: 16px;
                font-weight: 500;

                &::placeholder {
                  color: var(--text-color-light);
                }
              }
            }
          }
        }

        .form-actions {
          margin-top: 32px;

          .submit-btn {
            outline: none;
            color: white;
            width: 100%;
            height: 56px;
            border-radius: 16px;
            font-weight: 700;
            font-size: 18px;
            background: linear-gradient(
              135deg,
              var(--primary-color),
              var(--primary-light)
            );
            border: none;
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
            }

            &:active {
              transform: translateY(0);
            }
          }
        }
      }
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}
</style>
