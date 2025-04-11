import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for subscription state
export type SubscriptionPlan = 'monthly' | 'yearly' | 'none';

export interface SubscriptionState {
  isSubscribed: boolean;
  plan: SubscriptionPlan;
  trialEndDate: string | null;
  isInTrial: boolean;
  hasSeenSpecialOffer: boolean;
  showSpecialOffer: boolean;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  hasBeenOfferedTrial: boolean;
  hasDeclinedTrial: boolean;
}

// Initial state
const initialState: SubscriptionState = {
  isSubscribed: false,
  plan: 'none',
  trialEndDate: null,
  isInTrial: false,
  hasSeenSpecialOffer: false,
  showSpecialOffer: false,
  subscriptionStartDate: null,
  subscriptionEndDate: null,
  hasBeenOfferedTrial: false,
  hasDeclinedTrial: false,
};

// Create the slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // Trial management
    startTrial: (state) => {
      state.isInTrial = true;
      
      // Set trial end date to 3 days from now
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 3);
      state.trialEndDate = endDate.toISOString();
      
      state.hasBeenOfferedTrial = true;
    },
    endTrial: (state) => {
      state.isInTrial = false;
    },
    declineTrial: (state) => {
      state.hasDeclinedTrial = true;
      state.hasBeenOfferedTrial = true;
    },
    
    // Subscription management
    setSubscription: (state, action: PayloadAction<{ plan: SubscriptionPlan; startDate: string }>) => {
      state.isSubscribed = action.payload.plan !== 'none';
      state.plan = action.payload.plan;
      state.subscriptionStartDate = action.payload.startDate;
      
      // Calculate end date based on plan
      if (action.payload.plan !== 'none') {
        const endDate = new Date(action.payload.startDate);
        if (action.payload.plan === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (action.payload.plan === 'yearly') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }
        state.subscriptionEndDate = endDate.toISOString();
      } else {
        state.subscriptionEndDate = null;
      }
    },
    cancelSubscription: (state) => {
      // Keep the subscription active until the end date
      // but mark it as not renewing by maintaining the end date
    },
    
    // Special offer management
    showSpecialOffer: (state) => {
      if (!state.hasSeenSpecialOffer) {
        state.showSpecialOffer = true;
      }
    },
    hideSpecialOffer: (state) => {
      state.showSpecialOffer = false;
      state.hasSeenSpecialOffer = true;
    },
    acceptSpecialOffer: (state) => {
      state.showSpecialOffer = false;
      state.hasSeenSpecialOffer = true;
      
      // Will be followed by a setSubscription call to actually set the subscription
    },
  },
});

// Export actions and reducer
export const {
  startTrial,
  endTrial,
  declineTrial,
  setSubscription,
  cancelSubscription,
  showSpecialOffer,
  hideSpecialOffer,
  acceptSpecialOffer,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer; 