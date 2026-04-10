import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { useLocation, useNavigate } from 'react-router-dom';

import IconPlus from '../../../../components/Icon/IconPlus';
import IconTrash from '../../../../components/Icon/IconTrash';
import { useRedux } from '../../../../hooks';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { GetAllAdminUsers, CreateAdminUser, DeleteAdminUser } from '../../../../Redux/actions';
import { AdminMessages } from '../../../../Redux/admin/constants';
import type { KcUser, CreateUserDto } from '../../../../helpers';
import { RoleEnum } from '../../../../helpers';

enum MethodFormEnum { ADD = 'ADD', DEL = 'DEL' }

// ─── Modal Component ─────────────────────────────────────
interface ModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;   // ← Obligatoire
}

const Modal = ({ show, title, onClose, children }: ModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-danger text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4 dark:text-white">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────
const GestionUsers = () => {
  const { dispatch, appSelector } = useRedux();
  const location = useLocation();
  const navigate = useNavigate();

  const isManagerTab = location.pathname.includes('managers');
  const activeRole: RoleEnum = isManagerTab ? RoleEnum.MANAGER : RoleEnum.COLLABORATEUR;

  // Redux
  const { listUsers, loading, msg, error } = appSelector((state: any) => ({
    listUsers: state.Admin.listUsers ?? [],
    loading: state.Admin.loading ?? false,
    msg: state.Admin.msg ?? '',
    error: state.Admin.error ?? '',
  }));

  const filteredUsers: KcUser[] = useMemo(() => 
    listUsers.filter((u: KcUser) => u.roles?.includes(activeRole)),
    [listUsers, activeRole]
  );

  const collabCount = listUsers.filter((u: KcUser) => u.roles?.includes(RoleEnum.COLLABORATEUR)).length;
  const managerCount = listUsers.filter((u: KcUser) => u.roles?.includes(RoleEnum.MANAGER)).length;

  // States
  const [openPop, setOpenPop] = useState(false);
  const [methodForm, setMethodForm] = useState<MethodFormEnum>(MethodFormEnum.ADD);
  const [selectedUser, setSelectedUser] = useState<KcUser | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Form
  const [formValues, setFormValues] = useState<CreateUserDto>({
    email: '', firstName: '', lastName: '', username: '', password: '', kcRole: activeRole,
  });
  const [formErrors, setFormErrors] = useState<Partial<CreateUserDto>>({});

  // Effects
  useEffect(() => {
    dispatch(setPageTitle('Gestion Utilisateurs'));
    dispatch(GetAllAdminUsers());
  }, [dispatch]);

  // Reset quand on change d'onglet
  useEffect(() => {
    resetForm();
    setOpenPop(false);
    setSelectedUser(null);
  }, [activeRole]);

  useEffect(() => {
    if (msg === AdminMessages.CREATE || msg === AdminMessages.DELETE) {
      showNotification('success', msg);
      dispatch(GetAllAdminUsers());
      setOpenPop(false);
      setSelectedUser(null);
    }
    if (error) {
      showNotification('error', typeof error === 'string' ? error : 'Une erreur est survenue');
    }
  }, [msg, error, dispatch]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, msg: message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Validation
  const validationSchema = Yup.object({
    email: Yup.string().email('Email invalide').required('Email obligatoire'),
    firstName: Yup.string().required('Prénom obligatoire'),
    lastName: Yup.string().required('Nom obligatoire'),
    username: Yup.string().required('Username obligatoire'),
    password: Yup.string().min(6, 'Minimum 6 caractères').required('Mot de passe obligatoire'),
  });

  const validate = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      setFormErrors({});
      return true;
    } catch (err: any) {
      const errors: Partial<CreateUserDto> = {};
      err.inner?.forEach((e: any) => {
        errors[e.path as keyof CreateUserDto] = e.message;
      });
      setFormErrors(errors);
      return false;
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validate()) dispatch(CreateAdminUser(formValues));
  };

  const handleDeleteSubmit = () => {
    if (selectedUser?.id) dispatch(DeleteAdminUser(selectedUser.id));
  };

  const resetForm = () => {
    setFormValues({
      email: '', firstName: '', lastName: '', username: '', password: '', kcRole: activeRole
    });
    setFormErrors({});
  };

  // Columns
  const columns = useMemo<MRT_ColumnDef<KcUser>[]>(() => [
    { accessorKey: 'firstName', header: 'Prénom' },
    { accessorKey: 'lastName', header: 'Nom' },
    {
      accessorKey: 'email',
      header: 'Email',
      Cell: ({ cell }) => <span className="text-primary">{cell.getValue<string>() ?? '—'}</span>,
    },
    {
      accessorKey: 'username',
      header: 'Username',
      Cell: ({ cell }) => <span className="text-gray-500">{cell.getValue<string>() ?? '—'}</span>,
    },
  ], []);

  // Table
  const table = useMantineReactTable({
    columns,
    data: filteredUsers,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableRowActions: true,
    enableStickyHeader: true,

    initialState: {
      density: 'xs',
      pagination: { pageIndex: 0, pageSize: 15 },
      columnPinning: { right: ['mrt-row-actions'] },
    },

    state: { isLoading: loading },
    autoResetPageIndex: true,

    mantineTableProps: { striped: true },
    mantinePaginationProps: {
      rowsPerPageOptions: ['15', '30', '50'],
      radius: 'xl',
      size: 'sm'
    },
    mantineSearchTextInputProps: {
      placeholder: `Rechercher un ${isManagerTab ? 'manager' : 'collaborateur'}...`,
    },

    renderRowActions: ({ row }) => (
      <Tippy content="Supprimer" duration={1} className="rounded-[5px] bg-dark px-2 py-1 text-white text-[0.8rem]">
        <button
          className="p-1 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-danger/20"
          onClick={() => {
            setMethodForm(MethodFormEnum.DEL);
            setSelectedUser(row.original);
            setOpenPop(true);
          }}
        >
          <IconTrash className="w-5 h-5 shrink-0 hover:text-danger" />
        </button>
      </Tippy>
    ),

    mantineTableBodyCellProps: () => ({ style: { cursor: 'pointer' } }),
    mantineTableContainerProps: () => ({ style: { maxHeight: '55vh' } }),
  });

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-lg shadow-lg text-white font-semibold 
          ${notification.type === 'success' ? 'bg-success' : 'bg-danger'}`}>
          {notification.msg}
        </div>
      )}

      <div className="flex flex-col h-[calc(100vh_-190px)] space-y-3 p-5 text-gray-500">

        {/* Header */}
        <div className="flex items-center sm:flex-row flex-col sm:justify-between justify-center">
          <div className="w-full">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-danger rounded-full flex shrink-0 justify-center items-center text-white font-bold text-sm">
                GU
              </div>
              <div>
                <h2 className="text-xl font-semibold dark:text-white">Gestion Utilisateurs</h2>
                <span className="text-xs text-gray-400">
                  {collabCount} collaborateur(s) · {managerCount} manager(s)
                </span>
              </div>
            </div>
          </div>

          <div className="ltr:ml-auto rtl:mr-auto mt-3 sm:mt-0">
            <button
              type="button"
              className="p-2 text-sm font-semibold flex items-center gap-2 rounded-md bg-primary text-white hover:bg-primary/80 transition"
              onClick={() => { setMethodForm(MethodFormEnum.ADD); resetForm(); setOpenPop(true); }}
            >
             {/* Icône différente selon le rôle */}
    {isManagerTab ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 01-5.356-1.857M17 20H7m5-2v-2c0-.656-.126-1.284-.356-1.852M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.284.356-1.852m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M5 19.29V18a3 3 0 013-3h.01M12 4.354a4 4 0 01-.01 5.292M5 19.29V18a3 3 0 013-3h.01M19 19.29V18a3 3 0 01-3-3h-.01" />
      </svg>
    )}

    <span>Ajouter {isManagerTab ? 'Manager' : 'Collaborateur'}</span>
  </button>
</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white-light dark:border-[#1b2e4b]">
          <button
            onClick={() => navigate('/gestionusers/collaborateurs')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              !isManagerTab
                ? 'border-info text-info bg-info/5'
                : 'border-transparent text-gray-500 hover:text-info hover:bg-gray-50 dark:hover:bg-[#1a2035]'
            }`}
          >
            Collaborateurs
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${!isManagerTab ? 'bg-info/20 text-info' : 'bg-gray-100 dark:bg-[#1b2e4b] text-gray-400'}`}>
              {collabCount}
            </span>
          </button>

          <button
            onClick={() => navigate('/gestionusers/managers')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              isManagerTab
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-[#1a2035]'
            }`}
          >
            Managers
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isManagerTab ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-[#1b2e4b] text-gray-400'}`}>
              {managerCount}
            </span>
          </button>
        </div>

        {/* Table */}
        <MantineReactTable 
          key={activeRole} 
          table={table} 
        />
      </div>

      {/* ====================== MODALS ====================== */}

      {/* Modal Ajouter */}
      <Modal
        show={openPop && methodForm === MethodFormEnum.ADD}
        title={`Ajouter un ${isManagerTab ? 'manager' : 'collaborateur'}`}
        onClose={() => { setOpenPop(false); resetForm(); }}
      >
        <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Prénom *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Prénom..."
              value={formValues.firstName}
              onChange={e => setFormValues({ ...formValues, firstName: e.target.value })}
            />
            {formErrors.firstName && <p className="text-danger text-xs mt-1">{formErrors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Nom *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nom..."
              value={formValues.lastName}
              onChange={e => setFormValues({ ...formValues, lastName: e.target.value })}
            />
            {formErrors.lastName && <p className="text-danger text-xs mt-1">{formErrors.lastName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Email *</label>
            <input
              type="email"
              className="form-input"
              placeholder="email@exemple.com"
              value={formValues.email}
              onChange={e => setFormValues({ ...formValues, email: e.target.value })}
            />
            {formErrors.email && <p className="text-danger text-xs mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Username *</label>
            <input
              type="text"
              className="form-input"
              placeholder="username..."
              value={formValues.username}
              onChange={e => setFormValues({ ...formValues, username: e.target.value })}
            />
            {formErrors.username && <p className="text-danger text-xs mt-1">{formErrors.username}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Mot de passe *</label>
            <input
              type="password"
              className="form-input"
              placeholder="Minimum 6 caractères..."
              value={formValues.password}
              onChange={e => setFormValues({ ...formValues, password: e.target.value })}
            />
            {formErrors.password && <p className="text-danger text-xs mt-1">{formErrors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Rôle</label>
            <div className="form-input flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isManagerTab ? 'bg-primary/20 text-primary' : 'bg-info/20 text-info'}`}>
                {isManagerTab ? 'Manager' : 'Collaborateur'}
              </span>
              
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button type="button" onClick={() => { setOpenPop(false); resetForm(); }} className="btn btn-outline-danger">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn bg-primary text-white border-0">
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Supprimer */}
      <Modal
        show={openPop && methodForm === MethodFormEnum.DEL}
        title="Supprimer l'utilisateur"
        onClose={() => { setOpenPop(false); setSelectedUser(null); }}
      >
        <div className="text-center">
          <p className="text-white-dark mb-2">Voulez-vous vraiment supprimer :</p>
          <p className="font-semibold text-lg dark:text-white mb-1">
            {selectedUser?.firstName} {selectedUser?.lastName}
          </p>
          
          
          <div className="flex justify-center gap-4">
            <button 
              type="button" 
              onClick={() => { setOpenPop(false); setSelectedUser(null); }} 
              className="btn btn-outline-danger"
            >
              Annuler
            </button>
            <button 
              type="button" 
              disabled={loading} 
              onClick={handleDeleteSubmit} 
              className="btn bg-danger text-white border-0"
            >
              {loading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GestionUsers;