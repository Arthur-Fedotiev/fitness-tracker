import firebase from 'firebase/compat';

export function convertSnaps<T>(snaps: firebase.firestore.QuerySnapshot<T>): T[] {
  return <T[]>snaps.docs.map(snap => {
      return {
          id: snap.id,
          ...snap.data()
      };
  });
}