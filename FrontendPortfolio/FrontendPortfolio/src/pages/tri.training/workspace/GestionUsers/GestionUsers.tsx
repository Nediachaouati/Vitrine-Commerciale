// GestionUsers.tsx
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

import PopFormDynamicV3 from '../../../../components/Form/PopFormDynamicV3';

// Imports directs (comme dans FormDynamicV3 et PopFormDynamicV3)
import { MethodFormEnum } from '../../../../helpers/model/enum/method.form.enum';
import type { SubmitPayload } from '../../../../helpers/model/utils/SubmitPayload';

import { GetAllAdminUsers, CreateAdminUser, DeleteAdminUser } from '../../../../Redux/actions';
import { AdminMessages } from '../../../../Redux/admin/constants';
import type { KcUser } from '../../../../helpers';
import { RoleEnum } from '../../../../helpers';

const GestionUsers = () => {
  const { dispatch, appSelector } = useRedux();
  const location = useLocation();
  const navigate = useNavigate();

  const isManagerTab = location.pathname.includes('managers');
  const activeRole: RoleEnum = isManagerTab ? RoleEnum.MANAGER : RoleEnum.COLLABORATEUR;

  // Redux State
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

  // Fetch initial data
  useEffect(() => {
    dispatch(setPageTitle('Gestion Utilisateurs'));
    dispatch(GetAllAdminUsers());
  }, [dispatch]);

  // Reset when switching between Collaborateurs / Managers
  useEffect(() => {
    setOpenPop(false);
    setSelectedUser(null);
  }, [activeRole]);

  // Listen to Redux messages
  useEffect(() => {
    if (msg === AdminMessages.CREATE || msg === AdminMessages.DELETE) {
      alert(msg); // Remplace par ShowSweetAlert si tu l'as dans ton projet
      dispatch(GetAllAdminUsers());
      setOpenPop(false);
      setSelectedUser(null);
    }
    if (error) {
      alert(typeof error === 'string' ? error : 'Une erreur est survenue');
    }
  }, [msg, error, dispatch]);

  // ==================== FORM CONFIG (comme dans tr TRAINING) ====================
  const formConfigUser = {
    fields: [
      { name: 'firstName', label: 'Prénom', type: 'text', placeholder: 'Prénom...' },
      { name: 'lastName',  label: 'Nom',     type: 'text', placeholder: 'Nom...' },
      { name: 'email',     label: 'Email',   type: 'email', placeholder: 'email@exemple.com' },
      { name: 'username',  label: 'Username', type: 'text', placeholder: 'username...' },
      { name: 'password',  label: 'Mot de passe', type: 'password', placeholder: 'Minimum 6 caractères...' },
      {
        name: 'kcRole',
        label: 'Rôle',
        type: 'select',
        rsOptions: [
          { value: RoleEnum.COLLABORATEUR, label: 'Collaborateur' },
          { value: RoleEnum.MANAGER,       label: 'Manager' },
        ],
        disabled: true,
      },
    ],
    validationSchema: {
      firstName: Yup.string().required('Prénom obligatoire'),
      lastName:  Yup.string().required('Nom obligatoire'),
      email:     Yup.string().email('Email invalide').required('Email obligatoire'),
      username:  Yup.string().required('Username obligatoire'),
      password:  Yup.string().min(6, 'Minimum 6 caractères').required('Mot de passe obligatoire'),
    },
  };

  const initialUserValues = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    kcRole: activeRole,
  };

  // Submit Handler
  const handleCrudSubmit = (payload: SubmitPayload) => {
    if (payload.method === MethodFormEnum.DEL) {
      if (selectedUser?.id) {
        dispatch(DeleteAdminUser(selectedUser.id));
      }
    } else if (payload.method === MethodFormEnum.ADD) {
      dispatch(CreateAdminUser(payload.values));
    }
  };

  // Table Columns
  const columns = useMemo<MRT_ColumnDef<KcUser>[]>(() => [
    { accessorKey: 'firstName', header: 'Prénom' },
    { accessorKey: 'lastName',  header: 'Nom' },
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

  // Mantine React Table
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
    mantineTableProps: { striped: true },
    mantinePaginationProps: {
      rowsPerPageOptions: ['15', '30', '50'],
      radius: 'xl',
      size: 'sm',
    },
    mantineSearchTextInputProps: {
      placeholder: `Rechercher un ${isManagerTab ? 'manager' : 'collaborateur'}...`,
    },

    renderRowActions: ({ row }) => (
      <Tippy content="Supprimer" duration={1}>
        <button
          className="p-1 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-danger/20"
          onClick={() => {
            setMethodForm(MethodFormEnum.DEL);
            setSelectedUser(row.original);
            setOpenPop(true);
          }}
        >
          <IconTrash className="w-5 h-5 hover:text-danger" />
        </button>
      </Tippy>
    ),
  });

  return (
    <>
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
                
              </div>
            </div>
          </div>

          <div className="ltr:ml-auto rtl:mr-auto mt-3 sm:mt-0">
            <button
              type="button"
              className="p-2 text-sm font-semibold flex items-center gap-2 rounded-md bg-primary text-white hover:bg-primary/80 transition"
              onClick={() => {
                setMethodForm(MethodFormEnum.ADD);
                setSelectedUser(null);
                setOpenPop(true);
              }}
            >
              <IconPlus className="w-5 h-5" />
              Ajouter {isManagerTab ? 'Manager' : 'Collaborateur'}
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
        <MantineReactTable key={activeRole} table={table} />
      </div>

      {/* ====================== POPUP (comme dans tr TRAINING) ====================== */}
      <PopFormDynamicV3
        show={openPop}
        onClose={() => {
          setOpenPop(false);
          setSelectedUser(null);
        }}
        title={methodForm === MethodFormEnum.ADD 
          ? `Ajouter un ${isManagerTab ? 'Manager' : 'Collaborateur'}` 
          : "Supprimer l'utilisateur"}
        message={methodForm === MethodFormEnum.DEL 
          ? "Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible." 
          : "Remplissez les informations ci-dessous."}
        methodForm={methodForm}
        formConfig={formConfigUser}
        initialValues={methodForm === MethodFormEnum.ADD ? initialUserValues : (selectedUser ?? initialUserValues)}
        onSubmit={handleCrudSubmit}
        formClass="grid grid-cols-1 md:grid-cols-2 gap-4"
        largeur={5}
      />
    </>
  );
};

export default GestionUsers;