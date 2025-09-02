<script lang="ts">
  import { redirect } from '@sveltejs/kit';
    import { createEventDispatcher } from 'svelte';

// Types
interface LoginData {
    email: string;
    password: string;
    remember: boolean;
}

interface RegisterData {
    email: string;
    password: string;
}

interface ForgotPasswordData {
    email: string;
}

interface OTPData {
    otp: string;
    email: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    otp?: string;
    general?: string;
}
interface NewPasswordData {
    newPassword: string;
    confirmPassword: string;
}

// Event dispatcher for parent component communication
const dispatch = createEventDispatcher<{
    login: LoginData;
    register: RegisterData;
    forgotPassword: ForgotPasswordData;
    verifyOTP: OTPData;
    resendOTP: { email: string };
    resetPassword: NewPasswordData;
}>();

// Reactive state
let activeTab: 'login' | 'register' | 'forgot' | 'otp' | 'newPassword' | 'success' = 'login';


// Form data
let loginData: LoginData = {
    email: '',
    password: '',
    remember: false
};

let registerData: RegisterData = {
    email: '',
    password: ''
};

let forgotPasswordData: ForgotPasswordData = {
    email: ''
};
let newPasswordData: NewPasswordData = {
    newPassword: '',
    confirmPassword: ''
};
let passwordChangeSuccess = false;

// OTP form data
let otpDigits: string[] = ['', '', '', ''];

// Error states
let loginErrors: FormErrors = {};
let registerErrors: FormErrors = {};
let forgotPasswordErrors: FormErrors = {};
let otpErrors: FormErrors = {};
let newPasswordErrors: FormErrors = {};

// Success state for forgot password
// let forgotPasswordSuccess = false;


let currentFlow: 'login' | 'register' | 'forgotPassword' = 'login';


// Validation functions
const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address';
    }
    return undefined;
};

const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return undefined;
};

const validateOTP = (otp: string): string | undefined => {
    if (!otp) return 'OTP is required';
    if (otp.length !== 4) return 'Please enter a 4-digit OTP';
    if (!/^\d{4}$/.test(otp)) return 'OTP must contain only numbers';
    return undefined;
};

// Real-time validation
const validateLoginForm = () => {
    loginErrors = {
        email: validateEmail(loginData.email),
        password: validatePassword(loginData.password)
    };
};

const validateRegisterForm = () => {
    registerErrors = {
        email: validateEmail(registerData.email),
        password: validatePassword(registerData.password)
    };
};

const validateForgotPasswordForm = () => {
    forgotPasswordErrors = {
        email: validateEmail(forgotPasswordData.email)
    };
};

const validateOTPForm = () => {
    const otp = otpDigits.join('');
    otpErrors = {
        otp: validateOTP(otp)
    };
};
const validateNewPassword = (password: string, confirmPassword: string): { newPassword?: string; confirmPassword?: string } => {
    const errors: { newPassword?: string; confirmPassword?: string } = {};
    
    if (!password) {
        errors.newPassword = 'New password is required';
    } else if (password.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
        errors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
        errors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(password)) {
        errors.newPassword = 'Password must contain at least one number';
    }
    
    if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
};
const validateNewPasswordForm = () => {
    const errors = validateNewPassword(newPasswordData.newPassword, newPasswordData.confirmPassword);
    newPasswordErrors = {
        password: errors.newPassword,
        confirmPassword: errors.confirmPassword
    };
};

// Form handlers
const handleLogin = (event: Event) => {
    event.preventDefault();
    validateLoginForm();
    
    if (!loginErrors.email && !loginErrors.password) {
        dispatch('login', loginData);
        window.location.href = '/'; // Add this line
    }
};

const handleRegister = (event: Event) => {
    event.preventDefault();
    validateRegisterForm();
    
    if (!registerErrors.email && !registerErrors.password) {
        dispatch('register', registerData);
        currentFlow = 'register'; // Set current flow to register
        activeTab = 'otp'; // Go to OTP screen
    }
};

const handleForgotPassword = (event: Event) => {
    event.preventDefault();
    validateForgotPasswordForm();
    
    if (!forgotPasswordErrors.email) {
        dispatch('forgotPassword', forgotPasswordData);
        currentFlow = 'forgotPassword'; // Set current flow
        // forgotPasswordSuccess = true;
        // Switch to OTP screen after successful submission
        ;
    }
};
const handleOTPVerification = (event: Event) => {
    event.preventDefault();
    validateOTPForm();
    
    const otp = otpDigits.join('');
    if (!otpErrors.otp) {
        const emailToUse = currentFlow === 'register' ? registerData.email : forgotPasswordData.email;
        dispatch('verifyOTP', {
            otp,
            email: emailToUse
        });
        // Navigate to new password form after successful OTP verification
        activeTab = 'newPassword';
    }
};

const handleResendOTP = () => {
    const emailToUse = currentFlow === 'register' ? registerData.email : forgotPasswordData.email;
    if (currentFlow === 'register') {
        dispatch('register', registerData); // Resend registration OTP
    } else {
        dispatch('resendOTP', { email: emailToUse });
    }
};
const handleNewPassword = (event: Event) => {
    event.preventDefault();
    validateNewPasswordForm();
    
    if (!newPasswordErrors.password && !newPasswordErrors.confirmPassword) {
        dispatch('resetPassword', newPasswordData);
        // Show success screen after successful password reset
        passwordChangeSuccess = true;
        activeTab = 'success'; // Add this line
    }
};


// Tab switching
const switchTab = (tab: 'login' | 'register' | 'forgot' | 'otp' | 'newPassword' | 'success') => {
    activeTab = tab;
    // Set currentFlow based on tab
    if (tab === 'login') currentFlow = 'login';
    if (tab === 'register') currentFlow = 'register';
    if (tab === 'forgot') currentFlow = 'forgotPassword';
    
    // Clear errors when switching tabs
    loginErrors = {};
    registerErrors = {};
    forgotPasswordErrors = {};
    otpErrors = {};
    newPasswordErrors = {};
    // forgotPasswordSuccess = false;
    passwordChangeSuccess = false;
};

// Clear individual field errors on input
const clearLoginError = (field: keyof FormErrors) => {
    loginErrors[field] = undefined;
    loginErrors = { ...loginErrors };
};

const clearRegisterError = (field: keyof FormErrors) => {
    registerErrors[field] = undefined;
    registerErrors = { ...registerErrors };
};

const clearForgotPasswordError = (field: keyof FormErrors) => {
    forgotPasswordErrors[field] = undefined;
    forgotPasswordErrors = { ...forgotPasswordErrors };
};

const clearOTPError = () => {
    otpErrors.otp = undefined;
    otpErrors = { ...otpErrors };
};
const clearNewPasswordError = (field: keyof FormErrors) => {
    newPasswordErrors[field] = undefined;
    newPasswordErrors = { ...newPasswordErrors };
};

// Handle OTP input
const handleOTPInput = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/[^0-9]/g, '');
    
    if (value.length <= 1) {
        otpDigits[index] = value;
        otpDigits = [...otpDigits];
        
        clearOTPError();
        
        // Move to next input if value entered
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
            nextInput?.focus();
        }
    }
};

const handleOTPKeydown = (index: number, event: KeyboardEvent) => {
    // Move to previous input on backspace if current is empty
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
        prevInput?.focus();
    }
};

// Handle paste event for OTP inputs
const handleOTPPaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const numbers = pastedData.replace(/[^0-9]/g, '').slice(0, 4);
    
    if (numbers.length > 0) {
        // Fill the digits array with pasted numbers
        for (let i = 0; i < 4; i++) {
            otpDigits[i] = numbers[i] || '';
        }
        otpDigits = [...otpDigits];
        
        // Clear any existing errors
        clearOTPError();
        
        // Focus on the last filled input or the next empty one
        const lastFilledIndex = Math.min(numbers.length - 1, 3);
        const targetIndex = numbers.length < 4 ? numbers.length : 3;
        const targetInput = document.getElementById(`otp-${targetIndex}`) as HTMLInputElement;
        targetInput?.focus();
    }
};
const handleContinue = () => {
    // Redirect to home page or login
    switchTab('login')
};

// Export function to set external errors (e.g., from server)
export const setLoginError = (errors: FormErrors) => {
    loginErrors = { ...loginErrors, ...errors };
};

export const setRegisterError = (errors: FormErrors) => {
    registerErrors = { ...registerErrors, ...errors };
};

export const setForgotPasswordError = (errors: FormErrors) => {
    forgotPasswordErrors = { ...forgotPasswordErrors, ...errors };
};

export const setOTPError = (errors: FormErrors) => {
    otpErrors = { ...otpErrors, ...errors };
};

export const setNewPasswordError = (errors: FormErrors) => {
    newPasswordErrors = { ...newPasswordErrors, ...errors };
};

</script>

<div>
    <div class="max-w-md mx-auto">
        {#if activeTab === 'login' || activeTab === 'register'}
            <h2 class="text-2xl font-semibold mb-2">Get Started</h2>
            <p class="text-gray-500 text-sm mb-8">Enter your details or website below to continue:</p>
        {:else if activeTab === 'forgot'}
            <div class="mb-6">
                <button 
                    type="button" 
                    on:click={() => switchTab('login')}
                    class="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 cursor-pointer"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Back
                </button>
                <h2 class="text-2xl font-semibold mb-2">Forgot Password</h2>
                <p class="text-gray-500 text-sm mb-8">Please enter your registered email ID</p>
            </div>
            {:else if activeTab === 'otp'}
            <div class="mb-6">
                <button 
                    type="button" 
                    on:click={() => switchTab(currentFlow === 'register' ? 'register' : 'forgot')}
                    class="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 cursor-pointer"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Back
                </button>
                <h2 class="text-2xl font-semibold mb-2">Enter OTP</h2>
                <p class="text-gray-500 text-sm mb-8">Please enter your the verification code</p>
            </div>
            {/if}
    
        <!-- Tab Navigation (only show for login/register) -->
        {#if activeTab === 'login' || activeTab === 'register'}
            <div class="flex mb-6 relative">
                <button
                    type="button"
                    id="loginTab"
                    class="flex-1 py-2 px-4 {activeTab === 'login' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-l-lg focus:outline-none focus:ring-indigo-500 focus:ring-opacity-50 z-10 cursor-pointer"
                    on:click={() => switchTab('login')}
                >
                    Log in
                </button>
                <button
                    type="button"
                    id="registerTab"
                    class="flex-1 py-2 px-4 {activeTab === 'register' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-r-lg focus:outline-none focus:ring-gray-500 focus:ring-opacity-50 z-10 cursor-pointer"
                    on:click={() => switchTab('register')}
                >
                    Register
                </button>
                <!-- Tab Indicator -->
                <div
                    id="tabIndicator"
                    class="absolute top-0 left-0 w-1/2 h-full bg-indigo-600 rounded-lg transition-all duration-300 ease-in-out"
                    style="left: {activeTab === 'register' ? '50%' : '0'}"
                ></div>
            </div>
        {/if}
    
        <!-- Login Form -->
        <form 
            id="loginForm" 
            on:submit={handleLogin} 
            class="transition-opacity duration-300 ease-in-out {activeTab === 'login' ? '' : 'hidden'}"
        >
            <!-- General Login Error -->
            {#if loginErrors.general}
                <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-600">{loginErrors.general}</p>
                </div>
            {/if}

            <div class="mb-4">
                <label for="loginEmail" class="block text-sm font-medium text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </span>
                    <input
                        type="email"
                        id="loginEmail"
                        bind:value={loginData.email}
                        on:input={() => clearLoginError('email')}
                        class="pl-10 w-full px-3 py-2 border {loginErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 {loginErrors.email ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}"
                        placeholder="ronaldrichards@pagedone.com"
                        required
                    />
                    {#if loginErrors.email}
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    {/if}
                </div>
                {#if loginErrors.email}
                    <p class="mt-1 text-sm text-red-600">{loginErrors.email}</p>
                {/if}
            </div>

            <div class="mb-6">
                <label for="loginPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </span>
                    <input
                        type="password"
                        id="loginPassword"
                        bind:value={loginData.password}
                        on:input={() => clearLoginError('password')}
                        class="pl-10 w-full px-3 py-2 border {loginErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 {loginErrors.password ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}"
                        placeholder="••••••••••"
                        required
                    />
                    {#if loginErrors.password}
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    {/if}
                </div>
                {#if loginErrors.password}
                    <p class="mt-1 text-sm text-red-600">{loginErrors.password}</p>
                {/if}
            </div>

            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        bind:checked={loginData.remember}
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="remember" class="ml-2 block text-sm text-gray-700">
                        Keep me logged in
                    </label>
                </div>
                <button 
                    type="button"   
                    on:click={() => switchTab('forgot')}
                    class="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                    Forgot password?
                </button>
            </div>

            <button
                type="submit"
                class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            
            >
                Login
            </button>
        </form>
    
        <!-- Register Form -->
        <form 
            id="registerForm" 
            on:submit={handleRegister} 
            class="transition-opacity duration-300 ease-in-out {activeTab === 'register' ? '' : 'hidden'}"
        >
            <!-- General Register Error -->
            {#if registerErrors.general}
                <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-600">{registerErrors.general}</p>
                </div>
            {/if}

            <div class="mb-4">
                <label for="registerEmail" class="block text-sm font-medium text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <input
                        type="email"
                        id="registerEmail"
                        bind:value={registerData.email}
                        on:input={() => clearRegisterError('email')}
                        class="w-full px-3 py-2 border {registerErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 {registerErrors.email ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}"
                        placeholder="john@example.com"
                        required
                    />
                    {#if registerErrors.email}
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    {/if}
                </div>
                {#if registerErrors.email}
                    <p class="mt-1 text-sm text-red-600">{registerErrors.email}</p>
                {/if}
            </div>

           

            <button
                type="submit"
                class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                on:click={() => switchTab('otp')}
            >
                Register
            </button>
        </form>

        <!-- Forgot Password Form -->
        <form 
            id="forgotPasswordForm" 
            on:submit={handleForgotPassword} 
            class="transition-opacity duration-300 ease-in-out {activeTab === 'forgot' ? '' : 'hidden'}"
        >
            <!-- Success Message -->
            <!-- {#if forgotPasswordSuccess}
                <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-green-800">
                                Verification code sent!
                            </h3>
                            <div class="mt-2 text-sm text-green-700">
                                <p>We've sent a verification code to your registered email address. Please check your inbox and follow the instructions to reset your password.</p>
                            </div>
                        </div>
                    </div>
                </div>
            {/if} -->

            <!-- General Forgot Password Error -->
            {#if forgotPasswordErrors.general}
                <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-600">{forgotPasswordErrors.general}</p>
                </div>
            {/if}

            <div class="mb-6">
                <label for="forgotEmail" class="block text-sm font-medium text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </span>
                    <input
                        type="email"
                        id="forgotEmail"
                        bind:value={forgotPasswordData.email}
                        on:input={() => clearForgotPasswordError('email')}
                        class="pl-10 w-full px-3 py-2 border {forgotPasswordErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 {forgotPasswordErrors.email ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}"
                        placeholder="ronaldrichards@pagedone.com"
                        required
                    />
                    {#if forgotPasswordErrors.email}
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    {/if}
                </div>
                {#if forgotPasswordErrors.email}
                    <p class="mt-1 text-sm text-red-600">{forgotPasswordErrors.email}</p>
                {/if}
            </div>

            <p class="text-sm text-gray-500 mb-6">
                We will send a verification code to your registered email ID
            </p>

            <button
                type="submit"
                class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                on:click={()=> switchTab('otp')}
               
            >
                Next
            </button>
        </form>

        <!-- OTP Verification Form -->
        <form 
            id="otpForm" 
            on:submit={handleOTPVerification} 
            class="transition-opacity duration-300 ease-in-out {activeTab === 'otp' ? '' : 'hidden'}"
        >
            <!-- General OTP Error -->
            {#if otpErrors.general}
                <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-600">{otpErrors.general}</p>
                </div>
            {/if}

            <div class="mb-6">
                <div class="flex justify-center space-x-4">
                    {#each otpDigits as digit, index}
                        <input
                            type="text"
                            id="otp-{index}"
                            bind:value={digit}
                            on:input={(e) => handleOTPInput(index, e)}
                            on:keydown={(e) => handleOTPKeydown(index, e)}
                            on:paste={handleOTPPaste}
                            class="w-16 h-16 text-center text-2xl font-semibold border {otpErrors.otp ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 {otpErrors.otp ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}"
                            maxlength="1"
                            inputmode="numeric"
                            pattern="[0-9]"
                        />
                    {/each}
                </div>
                {#if otpErrors.otp}
                    <p class="mt-2 text-sm text-red-600 text-center">{otpErrors.otp}</p>
                {/if}
            </div>

            <p class="text-sm text-gray-500 text-center mb-6">
                {#if currentFlow === 'register'}
                    We have sent a verification code to your email ID for account verification
                {:else}
                    We have sent a verification code to your registered email ID
                {/if}
            </p>

            <button
                type="submit"
                class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4 cursor-pointer"
            >
                Next
            </button>

            <div class="text-center">
                <span class="text-sm text-gray-600">Didn't receive the email? </span>
                <button 
                    type="button"
                    on:click={handleResendOTP}
                    class="text-sm text-indigo-600 hover:text-indigo-500 font-medium cursor-pointer"
                >
                    Click to resend
                </button>
            </div>
        </form>
        <!-- New Password form -->
        <form 
        id="newPasswordForm" 
        on:submit={handleNewPassword} 
        class="transition-opacity duration-300 ease-in-out {activeTab === 'newPassword' ? '' : 'hidden'}"
    >
    {#if activeTab === 'newPassword'}
    <div class="mb-6">
        <button 
            type="button" 
            on:click={() => switchTab('otp')}
            class="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 cursor-pointer"
        >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back
        </button>
        <h2 class="text-2xl font-semibold mb-2">
            {currentFlow === 'register' ? 'Create Password' : 'New Password'}
        </h2>
        <p class="text-gray-500 text-sm mb-8">
            {currentFlow === 'register' ? 'Please create a secure password for your account.' : 'Please enter a new password.'}
        </p>
    </div>
{/if}
    
        <!-- General New Password Error -->
        {#if newPasswordErrors.general}
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{newPasswordErrors.general}</p>
            </div>
        {/if}
    
        <div class="mb-4">
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                {currentFlow === 'register' ? 'Password' : 'New Password'} <span class="text-red-500">*</span>
            </label>
            <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </span>
                <input
                    type="password"
                    id="newPassword"
                    bind:value={newPasswordData.newPassword}
                    on:input={() => clearNewPasswordError('password')}
                    class="pl-10 w-full px-3 py-2 border {newPasswordErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 {newPasswordErrors.password ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}"
                    placeholder="••••••••••"
                    required
                />
                {#if newPasswordErrors.password}
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                {/if}
            </div>
            {#if newPasswordErrors.password}
                <p class="mt-1 text-sm text-red-600">{newPasswordErrors.password}</p>
            {/if}
        </div>
    
        <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Re-enter Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </span>
                <input
                    type="password"
                    id="confirmPassword"
                    bind:value={newPasswordData.confirmPassword}
                    on:input={() => clearNewPasswordError('confirmPassword')}
                    class="pl-10 w-full px-3 py-2 border {newPasswordErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 {newPasswordErrors.confirmPassword ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}"
                    placeholder="••••••••••"
                    required
                />
                {#if newPasswordErrors.confirmPassword}
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                {/if}
            </div>
            {#if newPasswordErrors.confirmPassword}
                <p class="mt-1 text-sm text-red-600">{newPasswordErrors.confirmPassword}</p>
            {/if}
        </div>
    
        <!-- Password Requirements -->
        <div class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-3">Your password must contain</p>
            <div class="space-y-2">
                <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 {/[A-Z]/.test(newPasswordData.newPassword) ? 'text-green-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm text-gray-600">At least one capital letter</span>
                </div>
                <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 {/[a-z]/.test(newPasswordData.newPassword) ? 'text-green-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm text-gray-600">At least one lowercase letter</span>
                </div>
                <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 {/[0-9]/.test(newPasswordData.newPassword) ? 'text-green-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm text-gray-600">At least one number</span>
                </div>
                <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 {newPasswordData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm text-gray-600">Minimum character length is 8 characters</span>
                </div>
            </div>
        </div>
    
        <button
            type="submit"
            class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer`"
        >
        {currentFlow === 'register' ? 'Create Password' : 'Change Password'}
        </button>
    </form>
       <!-- Password Change Success Screen -->
       <div class="transition-opacity duration-300 ease-in-out {activeTab === 'success' ? '' : 'hidden'}">
        <div class="text-center">
            <!-- Success Icon -->
            <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full  mb-6"
            class:bg-indigo-100={currentFlow ==='register'}
            class:bg-green-100={currentFlow ==='forgotPassword'}>
                <svg class="h-10 w-10 " fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     class:text-indigo-600={currentFlow ==='register'}
                     class:text-green-600={currentFlow ==='forgotPassword'}
                     >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">{currentFlow === "forgotPassword" ? 'Password Changed Successfully': 'Account Creted Successfully'}</h2>
            <p class="text-gray-500 text-sm mb-8">{currentFlow === "forgotPassword" ? 'Please log into your account with new password.': 'Please log into your account'}</p>
            
            <button
                type="button"
                on:click={handleContinue}
                class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
                Continue
            </button>
        </div>
    </div>
    </div>
</div>