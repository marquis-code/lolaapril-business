// composables/useUser.ts
import { ref, watch, computed } from "vue";
import type { User, Business, BusinessSummary, AuthResponse } from "~/types/user";

const runtimeData = {
  user: ref<User | null>(null),
  business: ref<Business | null>(null),
  businesses: ref<BusinessSummary[]>([]),
  token: ref<string>(""),
  refreshToken: ref<string>(""),
};

const error = ref<string | null>(null);

// Helper functions for localStorage
const saveToLocalStorage = (key: string, value: any) => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Watch for changes in runtime data and sync to localStorage
watch(
  () => runtimeData.user.value,
  (val) => {
    saveToLocalStorage("user", val);
  },
  { deep: true }
);

watch(
  () => runtimeData.business.value,
  (val) => {
    saveToLocalStorage("business", val);
  },
  { deep: true }
);

watch(
  () => runtimeData.businesses.value,
  (val) => {
    saveToLocalStorage("businesses", val);
  },
  { deep: true }
);

watch(
  () => runtimeData.token.value,
  (val) => {
    saveToLocalStorage("token", val);
  }
);

watch(
  () => runtimeData.refreshToken.value,
  (val) => {
    saveToLocalStorage("refreshToken", val);
  }
);

// Initialize runtime data from localStorage on load
const initializeFromStorage = () => {
  if (typeof window !== 'undefined') {
    runtimeData.user.value = getFromLocalStorage<User | null>("user", null);
    runtimeData.business.value = getFromLocalStorage<Business | null>("business", null);
    runtimeData.businesses.value = getFromLocalStorage<BusinessSummary[]>("businesses", []);
    runtimeData.token.value = getFromLocalStorage<string>("token", "");
    runtimeData.refreshToken.value = getFromLocalStorage<string>("refreshToken", "");
    console.log('Initialized from storage - token present:', !!runtimeData.token.value);
  }
};

// Call initialization
initializeFromStorage();

export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL as string;

export const useUser = () => {
  const id = computed(() => 
    runtimeData?.user?.value?.id ?? 
    runtimeData?.user?.value?._id ?? 
    ""
  );

  const userId = computed(() => 
    runtimeData?.user?.value?.id ?? 
    runtimeData?.user?.value?._id ?? 
    ""
  );

  const businessId = computed(() => 
    runtimeData?.user?.value?.currentBusinessId ?? 
    runtimeData?.business?.value?.id ?? 
    ""
  );

  const subdomain = computed(() => 
    runtimeData?.business?.value?.subdomain ?? ""
  );

  const firstName = computed(() => 
    runtimeData?.user?.value?.firstName ?? ""
  );
  
  const lastName = computed(() => 
    runtimeData?.user?.value?.lastName ?? ""
  );
  
  const fullName = computed(() => 
    `${firstName.value} ${lastName.value}`.trim()
  );
  
  const email = computed(() => 
    runtimeData?.user?.value?.email ?? ""
  );
  
  const phone = computed(() => 
    runtimeData?.user?.value?.phone ?? ""
  );
  
  const role = computed(() => 
    runtimeData?.user?.value?.role ?? ""
  );

  const isLoggedIn = computed(() => {
    if (!runtimeData.token?.value) return false;
    return (
      runtimeData?.user?.value != null &&
      typeof runtimeData.user.value === "object"
    );
  });

  const isEmailVerified = computed(() => {
    return runtimeData?.user?.value?.emailVerified ?? false;
  });

  const isPhoneVerified = computed(() => {
    return runtimeData?.user?.value?.phoneVerified ?? false;
  });

  const isBusinessOwner = computed(() => {
    return runtimeData?.user?.value?.role === "business_owner";
  });

  const isAdmin = computed(() => {
    return runtimeData?.user?.value?.role === "admin";
  });

  const isStaff = computed(() => {
    return runtimeData?.user?.value?.role === "staff";
  });

  // Business related computed properties
  const currentBusiness = computed(() => 
    runtimeData?.business?.value
  );
  
  const businessName = computed(() => 
    runtimeData?.business?.value?.businessName ?? ""
  );
  
  const businessStatus = computed(() => 
    runtimeData?.business?.value?.status ?? ""
  );
  
  const isOnTrial = computed(() => 
    runtimeData?.business?.value?.status === "trial"
  );
  
  const trialEndsAt = computed(() => 
    runtimeData?.business?.value?.trialEndsAt
  );
  
  const subscription = computed(() => 
    runtimeData?.business?.value?.subscription
  );

  const allBusinesses = computed(() => 
    runtimeData?.businesses?.value ?? []
  );

  const ownedBusinesses = computed(() => 
    runtimeData?.user?.value?.ownedBusinesses ?? []
  );

  const adminBusinesses = computed(() => 
    runtimeData?.user?.value?.adminBusinesses ?? []
  );

  const logOut = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("business");
    localStorage.removeItem("businesses");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    
    // Clear runtime data
    runtimeData.user.value = null;
    runtimeData.business.value = null;
    runtimeData.businesses.value = [];
    runtimeData.token.value = "";
    runtimeData.refreshToken.value = "";
  };

  const setToken = (token: string) => {
    runtimeData.token.value = token;
    saveToLocalStorage("token", token);
  };

  const setRefreshToken = (token: string) => {
    runtimeData.refreshToken.value = token;
    saveToLocalStorage("refreshToken", token);
  };

  const createUser = (data: AuthResponse) => {
    console.log("Creating user with data:", data);
    
    try {
      // Set tokens
      runtimeData.token.value = data.accessToken;
      runtimeData.refreshToken.value = data.refreshToken;
      saveToLocalStorage("token", data.accessToken);
      saveToLocalStorage("refreshToken", data.refreshToken);

      // Set user data
      runtimeData.user.value = data.user;
      saveToLocalStorage("user", data.user);

      // Set business data
      if (data.business) {
        runtimeData.business.value = data.business;
        saveToLocalStorage("business", data.business);
      }

      // Set businesses list
      if (data.businesses && Array.isArray(data.businesses)) {
        runtimeData.businesses.value = data.businesses;
        saveToLocalStorage("businesses", data.businesses);
      }

      console.log("User created successfully");
      console.log("LocalStorage user:", getFromLocalStorage("user", null));
      console.log("LocalStorage business:", getFromLocalStorage("business", null));
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const updateUser = (newUser: Partial<User>) => {
    if (!runtimeData.user.value) {
      console.warn("No user to update");
      return;
    }

    // Merge the existing user data with the new user data
    const updatedUser = { ...runtimeData.user.value, ...newUser };

    // Update the runtimeData and localStorage
    runtimeData.user.value = updatedUser;
    saveToLocalStorage("user", updatedUser);
  };

  const updateBusiness = (newBusiness: Partial<Business>) => {
    if (!runtimeData.business.value) {
      console.warn("No business to update");
      return;
    }

    // Merge the existing business data with the new business data
    const updatedBusiness = { ...runtimeData.business.value, ...newBusiness };

    // Update the runtimeData and localStorage
    runtimeData.business.value = updatedBusiness;
    saveToLocalStorage("business", updatedBusiness);
  };

  const switchBusiness = (businessId: string) => {
    const business = runtimeData.businesses.value.find(b => b.id === businessId);
    
    if (!business) {
      console.error("Business not found:", businessId);
      return;
    }

    // Update current business ID in user
    if (runtimeData.user.value) {
      updateUser({ currentBusinessId: businessId });
    }

    // In a real app, you'd probably want to call an API to get full business details
    // and then call updateBusiness() with the complete data
  };

  const getToken = () => runtimeData.token.value;
  const getRefreshToken = () => runtimeData.refreshToken.value;

  return {
    // User properties
    id,
    userId,
    firstName,
    lastName,
    fullName,
    email,
    phone,
    role,
    user: computed(() => runtimeData.user.value),
    
    // Business properties
    businessId,
    subdomain,
    businessName,
    businessStatus,
    currentBusiness,
    allBusinesses,
    ownedBusinesses,
    adminBusinesses,
    isOnTrial,
    trialEndsAt,
    subscription,
    
    // Auth properties
    token: computed(() => runtimeData.token.value),
    refreshToken: computed(() => runtimeData.refreshToken.value),
    
    // Status flags
    isLoggedIn,
    isEmailVerified,
    isPhoneVerified,
    isBusinessOwner,
    isAdmin,
    isStaff,
    
    // Methods
    createUser,
    updateUser,
    updateBusiness,
    switchBusiness,
    logOut,
    setToken,
    setRefreshToken,
    getToken,
    getRefreshToken,
    
    // Raw data (for compatibility)
    ...runtimeData,
  };
};