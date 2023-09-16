import { QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';

export const convertOneSnap = <TDocumentData>(
  snap: QueryDocumentSnapshot<TDocumentData>,
) => ({
  id: snap.id,
  ...snap.data(),
});

export const convertSnaps = <TDocumentData>(
  snaps: QuerySnapshot<TDocumentData>,
) => snaps.docs.map(convertOneSnap);
