import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Типы данных
interface CreateWorkspacePayload {
  name: string;
  description?: string | null;
  isPersonal: boolean;
  teamId?: string | null;
  activeApproach?: string;
  defaultTags?: string[];
  settings?: { [key: string]: any };
}

interface UpdateWorkspacePayload {
  workspaceId: string;
  name?: string;
  description?: string | null;
  activeApproach?: string;
  defaultTags?: string[];
  settings?: { [key: string]: any };
}

interface WorkspaceClientDto {
  id: string;
  name: string;
  description: string | null;
  ownerUid: string;
  isPersonal: boolean;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
  activeApproach: string;
  defaultTags: string[];
  settings: { [key: string]: any };
  currentUserWorkspaceRole?: 'owner' | 'admin' | 'manager' | 'editor' | 'member' | 'viewer' | null;
}

// Функция для создания рабочего пространства
export const createWorkspace = functions.https.onCall(
  async (data: CreateWorkspacePayload, context) => {
    // Проверка аутентификации
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Пользователь не авторизован');
    }

    const uid = context.auth.uid;
    const db = admin.firestore();

    try {
      const workspaceRef = db.collection('workspaces').doc();
      const now = admin.firestore.Timestamp.now();

      const workspaceData = {
        id: workspaceRef.id,
        name: data.name,
        description: data.description || null,
        ownerUid: uid,
        isPersonal: data.isPersonal,
        teamId: data.teamId || null,
        createdAt: now,
        updatedAt: now,
        activeApproach: data.activeApproach || 'default',
        defaultTags: data.defaultTags || [],
        settings: data.settings || {},
      };

      await workspaceRef.set(workspaceData);

      // Добавляем пользователя как владельца в коллекцию workspace_members
      await db.collection('workspace_members').add({
        workspaceId: workspaceRef.id,
        userId: uid,
        role: 'owner',
        joinedAt: now,
      });

      const workspace: WorkspaceClientDto = {
        ...workspaceData,
        createdAt: workspaceData.createdAt.toDate().toISOString(),
        updatedAt: workspaceData.updatedAt.toDate().toISOString(),
        currentUserWorkspaceRole: 'owner',
      };

      return { workspace };
    } catch (error) {
      console.error('Ошибка создания workspace:', error);
      throw new functions.https.HttpsError('internal', 'Ошибка создания рабочего пространства');
    }
  }
);

// Функция для получения рабочих пространств пользователя
export const getUserWorkspaces = functions.https.onCall(
  async (data, context) => {
    // Проверка аутентификации
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Пользователь не авторизован');
    }

    const uid = context.auth.uid;
    const db = admin.firestore();

    try {
      // Получаем все workspace_members записи для пользователя
      const membershipSnapshot = await db
        .collection('workspace_members')
        .where('userId', '==', uid)
        .get();

      if (membershipSnapshot.empty) {
        return { workspaces: [] };
      }

      // Получаем ID всех рабочих пространств пользователя
      const workspaceIds = membershipSnapshot.docs.map(doc => doc.data().workspaceId);
      const membershipByWorkspace = new Map();
      
      membershipSnapshot.docs.forEach(doc => {
        const data = doc.data();
        membershipByWorkspace.set(data.workspaceId, data);
      });

      // Получаем данные всех рабочих пространств
      const workspacePromises = workspaceIds.map(id => 
        db.collection('workspaces').doc(id).get()
      );
      
      const workspaceSnapshots = await Promise.all(workspacePromises);
      
      const workspaces: WorkspaceClientDto[] = workspaceSnapshots
        .filter(snapshot => snapshot.exists)
        .map(snapshot => {
          const data = snapshot.data()!;
          const membership = membershipByWorkspace.get(snapshot.id);
          
          return {
            id: snapshot.id,
            name: data.name,
            description: data.description,
            ownerUid: data.ownerUid,
            isPersonal: data.isPersonal,
            teamId: data.teamId,
            createdAt: data.createdAt.toDate().toISOString(),
            updatedAt: data.updatedAt.toDate().toISOString(),
            activeApproach: data.activeApproach,
            defaultTags: data.defaultTags || [],
            settings: data.settings || {},
            currentUserWorkspaceRole: membership?.role || null,
          };
        });

      return { workspaces };
    } catch (error) {
      console.error('Ошибка получения workspaces:', error);
      throw new functions.https.HttpsError('internal', 'Ошибка получения рабочих пространств');
    }
  }
);

// Функция для получения деталей рабочего пространства
export const getWorkspaceDetails = functions.https.onCall(
  async (data: { workspaceId: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Пользователь не авторизован');
    }

    const uid = context.auth.uid;
    const { workspaceId } = data;
    const db = admin.firestore();

    try {
      // Проверяем доступ пользователя к workspace
      const membershipSnapshot = await db
        .collection('workspace_members')
        .where('workspaceId', '==', workspaceId)
        .where('userId', '==', uid)
        .limit(1)
        .get();

      if (membershipSnapshot.empty) {
        throw new functions.https.HttpsError('permission-denied', 'Нет доступа к рабочему пространству');
      }

      // Получаем данные workspace
      const workspaceDoc = await db.collection('workspaces').doc(workspaceId).get();
      
      if (!workspaceDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Рабочее пространство не найдено');
      }

      const workspaceData = workspaceDoc.data()!;
      const membership = membershipSnapshot.docs[0].data();

      const workspace: WorkspaceClientDto = {
        id: workspaceDoc.id,
        name: workspaceData.name,
        description: workspaceData.description,
        ownerUid: workspaceData.ownerUid,
        isPersonal: workspaceData.isPersonal,
        teamId: workspaceData.teamId,
        createdAt: workspaceData.createdAt.toDate().toISOString(),
        updatedAt: workspaceData.updatedAt.toDate().toISOString(),
        activeApproach: workspaceData.activeApproach,
        defaultTags: workspaceData.defaultTags || [],
        settings: workspaceData.settings || {},
        currentUserWorkspaceRole: membership.role,
      };

      return { workspace };
    } catch (error) {
      console.error('Ошибка получения деталей workspace:', error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError('internal', 'Ошибка получения деталей рабочего пространства');
    }
  }
);

// Функция для обновления рабочего пространства
export const updateWorkspace = functions.https.onCall(
  async (data: UpdateWorkspacePayload, context) => {
    console.log('updateWorkspace called with data:', JSON.stringify(data, null, 2));
    
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Пользователь не авторизован');
    }

    const uid = context.auth.uid;
    const { workspaceId, ...updateData } = data;
    const db = admin.firestore();

    console.log('Update data received:', { workspaceId, updateData, uid });

    try {
      // Проверяем, что workspaceId предоставлен
      if (!workspaceId) {
        throw new functions.https.HttpsError('invalid-argument', 'workspaceId обязателен');
      }

      // Проверяем права доступа (должен быть владелец или админ)
      const membershipSnapshot = await db
        .collection('workspace_members')
        .where('workspaceId', '==', workspaceId)
        .where('userId', '==', uid)
        .limit(1)
        .get();

      console.log('Membership check:', { 
        workspaceId, 
        uid, 
        foundMembership: !membershipSnapshot.empty 
      });

      if (membershipSnapshot.empty) {
        throw new functions.https.HttpsError('permission-denied', 'Нет доступа к рабочему пространству');
      }

      const membership = membershipSnapshot.docs[0].data();
      console.log('User membership role:', membership.role);
      
      if (!['owner', 'admin'].includes(membership.role)) {
        throw new functions.https.HttpsError('permission-denied', 'Недостаточно прав для изменения рабочего пространства');
      }

      // Проверяем, что workspace существует
      const workspaceRef = db.collection('workspaces').doc(workspaceId);
      const currentWorkspace = await workspaceRef.get();
      
      if (!currentWorkspace.exists) {
        throw new functions.https.HttpsError('not-found', 'Рабочее пространство не найдено');
      }

      // Фильтруем и очищаем данные для обновления
      const cleanUpdateData: any = {};
      
      if (updateData.name !== undefined) cleanUpdateData.name = updateData.name;
      if (updateData.description !== undefined) cleanUpdateData.description = updateData.description;
      if (updateData.activeApproach !== undefined) cleanUpdateData.activeApproach = updateData.activeApproach;
      if (updateData.defaultTags !== undefined) cleanUpdateData.defaultTags = updateData.defaultTags;
      if (updateData.settings !== undefined) cleanUpdateData.settings = updateData.settings;
      
      const updatePayload = {
        ...cleanUpdateData,
        updatedAt: admin.firestore.Timestamp.now(),
      };

      console.log('Final update payload:', updatePayload);

      await workspaceRef.update(updatePayload);
      console.log('Workspace updated successfully');

      // Получаем обновленные данные
      const updatedDoc = await workspaceRef.get();
      const updatedData = updatedDoc.data()!;

      const updatedWorkspace: WorkspaceClientDto = {
        id: updatedDoc.id,
        name: updatedData.name,
        description: updatedData.description,
        ownerUid: updatedData.ownerUid,
        isPersonal: updatedData.isPersonal,
        teamId: updatedData.teamId,
        createdAt: updatedData.createdAt.toDate().toISOString(),
        updatedAt: updatedData.updatedAt.toDate().toISOString(),
        activeApproach: updatedData.activeApproach,
        defaultTags: updatedData.defaultTags || [],
        settings: updatedData.settings || {},
        currentUserWorkspaceRole: membership.role,
      };

      console.log('Returning updated workspace:', updatedWorkspace.name);
      return { success: true, updatedWorkspace };
    } catch (error) {
      console.error('Ошибка обновления workspace:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError('internal', `Failed to update workspace: ${error.message}`);
    }
  }
);

// Функция для удаления рабочего пространства
export const deleteWorkspace = functions.https.onCall(
  async (data: { workspaceId: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Пользователь не авторизован');
    }

    const uid = context.auth.uid;
    const { workspaceId } = data;
    const db = admin.firestore();

    try {
      // Проверяем, что пользователь - владелец workspace
      const workspaceDoc = await db.collection('workspaces').doc(workspaceId).get();
      
      if (!workspaceDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Рабочее пространство не найдено');
      }

      const workspaceData = workspaceDoc.data()!;
      if (workspaceData.ownerUid !== uid) {
        throw new functions.https.HttpsError('permission-denied', 'Только владелец может удалить рабочее пространство');
      }

      // Удаляем все записи членства
      const membershipSnapshot = await db
        .collection('workspace_members')
        .where('workspaceId', '==', workspaceId)
        .get();

      const batch = db.batch();
      membershipSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Удаляем сам workspace
      batch.delete(workspaceDoc.ref);

      await batch.commit();

      return { success: true, message: 'Рабочее пространство успешно удалено' };
    } catch (error) {
      console.error('Ошибка удаления workspace:', error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError('internal', 'Ошибка удаления рабочего пространства');
    }
  }
);
