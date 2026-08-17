import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { convertSnaps } from '@fitness-tracker/shared/utils';
import { Program } from '../entities/models/program';

export type ProgramCollection = CollectionReference<Program>;

/**
 * Firestore access for the `program` domain. Plain `async`/`await` over the modular
 * SDK, not Observables — this domain's internals are private behind its module
 * boundary, so its I/O style can differ from `exercise`/`workout`'s Effects-driven one.
 * See .scratch/strength-reload-calculator/issues/08-real-implementation-architecture.md.
 */
@Injectable({ providedIn: 'root' })
export class ProgramService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly afs = inject(Firestore);
  private readonly programCollectionRef = collection(this.afs, 'programs') as ProgramCollection;

  async findPrograms(userId: string): Promise<Program[]> {
    const snapshot = await runInInjectionContext(this.injector, () =>
      getDocs(query(this.programCollectionRef, where('userId', '==', userId))),
    );
    return convertSnaps(snapshot);
  }

  async createProgram(program: Omit<Program, 'id'>): Promise<Program> {
    const ref = await addDoc(this.programCollectionRef, program as Program);
    return { ...program, id: ref.id };
  }

  async updateProgram(program: Program): Promise<void> {
    await setDoc(doc(this.programCollectionRef, program.id), program);
  }

  async deleteProgram(programId: string): Promise<void> {
    await deleteDoc(doc(this.programCollectionRef, programId));
  }
}
