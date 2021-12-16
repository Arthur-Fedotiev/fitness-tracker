import firebase from 'firebase/compat/app';

export const convertOneSnap = <T>(snap: any): T =>
  <T>{
    id: snap.id,
    ...snap.data(),
  };

export function convertSnaps<T>(
  snaps: firebase.firestore.QuerySnapshot<T>,
): T[] {
  return <T[]>snaps.docs.map(convertOneSnap);
}

export function convertSnapsToDictionary<T, P = unknown>(
  snaps: firebase.firestore.QuerySnapshot<P>,
): T {
  return <T>(
    snaps.docs.reduce((acc, snap) => ({ ...acc, [snap.id]: snap.data() }), {})
  );
}
