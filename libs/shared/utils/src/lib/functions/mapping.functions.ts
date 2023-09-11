import { QuerySnapshot } from '@angular/fire/firestore';
import { WithId } from '../..';

export const convertOneSnap = <T>(snap: any): T =>
  <WithId<T>>{
    id: snap.id,
    ...snap.data(),
  };

export function convertSnaps<T>(snaps: any): WithId<T>[] {
  return <WithId<T>[]>snaps.docs.map(convertOneSnap);
}

export function convertSnapsToDictionary<T, P = unknown>(
  snaps: QuerySnapshot<P>,
): WithId<T> {
  return <WithId<T>>(
    snaps.docs.reduce((acc, snap) => ({ ...acc, [snap.id]: snap.data() }), {})
  );
}
