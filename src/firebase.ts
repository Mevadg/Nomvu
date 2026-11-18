import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseAuthUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

export interface UserProfileRecord {
  uid: string;
  fullname: string;
  email: string;
  age: number;
  state: string;
  phone: string;
  interests: string[];
  consentAccepted: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface EventRecord {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'gratis' | 'pago';
  priceLabel: string;
  dateLabel: string;
  state: string;
  city: string;
  spotsLeft: number;
  image: string;
  whatsapp: string;
  externalLink: string;
  authorUid?: string;
  authorName?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function signInWithGooglePopup(): Promise<FirebaseAuthUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(
  callback: (user: FirebaseAuthUser | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export function subscribeToUserProfile(
  uid: string,
  onChange: (profile: UserProfileRecord | null) => void
): Unsubscribe {
  const path = `users/${uid}`;
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      onChange(snap.exists() ? (snap.data() as UserProfileRecord) : null);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export interface SaveProfileInput {
  fullname: string;
  age: number;
  state: string;
  phone: string;
  interests: string[];
  consentAccepted: boolean;
}

export async function saveUserProfileToFirestore(
  authUser: FirebaseAuthUser,
  input: SaveProfileInput
): Promise<UserProfileRecord> {
  const path = `users/${authUser.uid}`;
  const userRef = doc(db, 'users', authUser.uid);

  let existingSnap;
  try {
    existingSnap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  const sanitizedFullname = input.fullname.trim().slice(0, 120);
  const sanitizedState = input.state.trim().slice(0, 60);
  const sanitizedPhone = input.phone.trim().slice(0, 30);
  const sanitizedInterests = input.interests.slice(0, 15);
  const clampedAge = Math.min(120, Math.max(14, Math.round(input.age)));

  if (!existingSnap.exists()) {
    const createPayload = {
      uid: authUser.uid,
      fullname: sanitizedFullname,
      email: (authUser.email || '').slice(0, 160),
      age: clampedAge,
      state: sanitizedState,
      phone: sanitizedPhone,
      interests: sanitizedInterests,
      consentAccepted: Boolean(input.consentAccepted),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(userRef, createPayload);
      return { ...createPayload };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  } else {
    const existingData = existingSnap.data() as UserProfileRecord;
    const updatePayload = {
      fullname: sanitizedFullname,
      age: clampedAge,
      state: sanitizedState,
      phone: sanitizedPhone,
      interests: sanitizedInterests,
      consentAccepted: Boolean(input.consentAccepted),
      updatedAt: serverTimestamp(),
    };
    try {
      await updateDoc(userRef, updatePayload);
      return {
        ...existingData,
        ...updatePayload,
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

export function subscribeToCatalogEvents(
  onUpdate: (events: EventRecord[]) => void
): Unsubscribe {
  const eventsPath = 'events';
  const eventsQuery = query(collection(db, eventsPath), orderBy('createdAt', 'desc'));
  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      const events = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as EventRecord),
        id: docSnap.id,
      }));
      onUpdate(events);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, eventsPath);
    }
  );
}

export interface PublishEventInput {
  title: string;
  description?: string;
  category: string;
  type: 'gratis' | 'pago';
  priceLabel: string;
  dateLabel: string;
  state: string;
  city: string;
  spotsLeft: number;
  image: string;
  whatsapp: string;
  externalLink: string;
}

export async function publishEventToFirestore(
  authUser: FirebaseAuthUser,
  profile: UserProfileRecord | null,
  input: PublishEventInput
): Promise<EventRecord> {
  const eventId = `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const path = `events/${eventId}`;

  const payload = {
    id: eventId,
    title: input.title.trim().slice(0, 160),
    description: (input.description || '').trim().slice(0, 320),
    category: input.category.trim().slice(0, 60),
    type: input.type,
    priceLabel: input.priceLabel.trim().slice(0, 40),
    dateLabel: input.dateLabel.trim().slice(0, 80),
    state: input.state.trim().slice(0, 60),
    city: (input.city || 'Por confirmar').trim().slice(0, 80),
    spotsLeft: Math.min(100000, Math.max(1, Math.round(input.spotsLeft))),
    image: input.image.slice(0, 200000),
    whatsapp: input.whatsapp.trim().slice(0, 30),
    externalLink: (input.externalLink || '').trim().slice(0, 400),
    authorUid: authUser.uid,
    authorName: (profile?.fullname || authUser.displayName || authUser.email || 'Productor').slice(
      0,
      120
    ),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'events', eventId), payload);
    return { ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
