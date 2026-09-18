# QuestionMark Mobile (React Native)

QuestionMark is a diagnostic mistake-tracking and micro-revision mobile application engineered for serious JEE Main & JEE Advanced aspirants.

---

## Architecture & Visual System

- **Color Palette**:
  - `Background`: `#FAFAF9` (warm off-white matte canvas)
  - `Surface`: `#FFFFFF` (1px bordered cards for focal points)
  - `Text Primary`: `#14171C` (high-contrast near-black)
  - `Text Secondary`: `#5C6470` (muted slate for metadata)
  - `Dividers`: `#E4E2DD` (1px hairline row separators)
  - `Primary Accent`: `#26314D` (deep indigo-navy)
  - `Highlight Amber`: `#C7862B` (restricted exclusively to the Rank-Impact figure and Streak badge)
  - `Careless Alert`: `#A6432E` (for calculation errors & question misreads)
  - `Success`: `#3A7A55` (for completed daily revision blocks)

- **Key Capabilities**:
  - **Camera / Gallery Question Logger**: Snap wrong questions directly from mock test booklets using `expo-camera` and `expo-image-picker`.
  - **Projected Rank Penalty**: Calculates avoidable rank loss caused by careless slips.
  - **Targeted Practice**: Generate JEE questions specifically targeting past weak chapters.
  - **Tonight's Plan**: 25-minute nightly revision sequences (15 min + 10 min blocks) with streak persistence.
  - **Offline-Safe Auth**: Token and user persistence using `@react-native-async-storage/async-storage`.

---

## Directory Structure

```
frontend/
├── App.tsx                     # Main application entry point
├── app.json                    # Expo configuration & mobile permissions
├── babel.config.js             # Babel preset for Expo/React Native
├── index.js                    # Root component registration
├── package.json                # Dependencies & mobile scripts
├── tsconfig.json               # TypeScript compiler options
└── src/
    ├── api/
    │   └── client.ts           # Axios instance with AsyncStorage token interceptor
    ├── components/
    │   ├── Loader.tsx          # Clean activity indicator
    │   ├── MistakeListItem.tsx # 1px hairline row with expandable question details
    │   ├── RankImpactCard.tsx  # Rank penalty card with bold amber #C7862B score
    │   ├── StreakBadge.tsx     # Streak counter with amber #C7862B number
    │   ├── UploadCard.tsx      # Camera/gallery picker, subject/test selection
    │   └── WeakChapterRow.tsx  # Hairline list row with chapter practice launcher
    ├── context/
    │   └── AuthContext.tsx     # Session management with AsyncStorage
    ├── navigation/
    │   ├── AuthStack.tsx       # Login & Register stack navigator
    │   ├── MainTabs.tsx        # 4-tab bottom navigation (Track, Weak spots, Tonight's plan, Profile)
    │   └── RootNavigator.tsx   # Auth-state aware root container
    ├── screens/
    │   ├── LoginScreen.tsx     # Clean student login
    │   ├── ProfileScreen.tsx   # Student details, target exam/year, enrolled subjects & test series
    │   ├── RegisterScreen.tsx  # Aspirant onboarding
    │   ├── TonightsPlanScreen.tsx # Nightly 25-minute revision block & 7-day history
    │   ├── TrackScreen.tsx     # Camera capture card, filters, and past mistake logs
    │   └── WeakSpotsScreen.tsx # Rank penalty, weak chapters, practice questions & error breakdown
    ├── theme/
    │   ├── colors.ts           # Design tokens
    │   └── typography.ts       # Font scales and typographic rhythm
    └── types/
        └── index.ts            # Type definitions matching the QuestionMark backend
```

---

## Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Backend API URL

By default, `src/api/client.ts` automatically routes:
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **iOS Simulator**: `http://localhost:5000/api`
- **Physical Device**: Set `EXPO_PUBLIC_API_URL` to your local computer's Wi-Fi IP address (e.g. `http://192.168.1.100:5000/api`) or your cloud deployment URL.

Create a `.env` file in `frontend/`:
```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000/api
```

### 3. Run the App

Start the Expo development server:
```bash
npm start
```

- Press `a` to open on an Android emulator or connected device.
- Press `i` to open on an iOS simulator.
- Scan the QR code using the **Expo Go** app on your physical iOS or Android phone.

---

## Demo Credentials

- **Email**: `student@jee.com`
- **Password**: `password123`
