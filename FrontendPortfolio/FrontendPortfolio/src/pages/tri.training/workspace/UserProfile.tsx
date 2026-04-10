import React, { useEffect, useState } from 'react';
import { useRedux } from '../../../hooks';
import { GetMyProfile, UpdateMyProfile, UploadAvatar } from '../../../Redux/profile/actions';

const UserProfile = () => {
    const { dispatch, appSelector } = useRedux();

    // Récupération des données depuis Redux
    const { profile, loading } = appSelector((state: any) => ({
        profile: state.Profile?.profile,
        loading: state.Profile?.loading ?? false,
    }));

    // États locaux pour le formulaire et l'image
    const [formValues, setFormValues] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Générateur de placeholder si l'image est absente
    const getPlaceholder = (first: string, last: string) => 
        `https://ui-avatars.com/api/?name=${first}+${last}&background=e7515a&color=fff`;

    // Chargement initial du profil
    useEffect(() => {
        dispatch(GetMyProfile());
    }, [dispatch]);

    // Synchronisation du formulaire avec les données du profil
    useEffect(() => {
        if (profile && !isEditing) {
            setFormValues({ ...profile });
            setPreviewUrl(profile.avatarUrl || getPlaceholder(profile.firstName, profile.lastName));
        }
    }, [profile, isEditing]);

    // Gestion des changements dans les inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormValues((prev: any) => ({ ...prev, [name]: val }));
    };

    // Gestion de l'upload d'image (prévisualisation locale)
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Mise à jour des informations textuelles
        dispatch(UpdateMyProfile(formValues));

        // 2. Upload de l'avatar si un nouveau fichier a été choisi
        if (avatarFile) {
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            dispatch(UploadAvatar(formData));
        }

        setIsEditing(false);
        setAvatarFile(null);
    };

    if (!profile) return <div className="p-5 text-center">Chargement du profil...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>
            
            <div className="bg-white dark:bg-black rounded-2xl shadow-sm p-8 border border-white-light dark:border-[#1b2e4b]">
                
                {/* --- HEADER : AVATAR ET RÔLE --- */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative">
                        <img
                            src={previewUrl || ''}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-black shadow-md"
                            onError={(e) => { (e.target as HTMLImageElement).src = getPlaceholder(profile.firstName, profile.lastName); }}
                        />
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-danger text-white p-2 rounded-full cursor-pointer hover:bg-red-600 transition shadow-lg">
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/>
                                </svg>
                            </label>
                        )}
                    </div>
                    <h3 className="mt-4 text-xl font-bold uppercase">{formValues.firstName} {formValues.lastName}</h3>
                    
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* --- SECTION : INFORMATIONS DE BASE --- */}
                    <div className="md:col-span-2 border-b border-white-light dark:border-[#1b2e4b] pb-2 mb-2">
                        <h5 className="font-bold text-danger">Informations de base</h5>
                    </div>

                    <div className="md:col-span-1">
                        <label className="text-sm font-semibold mb-1 block">Prénom</label>
                        <input name="firstName" className="form-input" value={formValues.firstName || ''} onChange={handleChange} disabled={!isEditing} />
                    </div>

                    <div className="md:col-span-1">
                        <label className="text-sm font-semibold mb-1 block">Nom</label>
                        <input name="lastName" className="form-input" value={formValues.lastName || ''} onChange={handleChange} disabled={!isEditing} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold mb-1 block">Email professionnel</label>
                        <input name="email" className="form-input" value={formValues.email || ''} onChange={handleChange} disabled={!isEditing} />
                    </div>

                    {isEditing && (
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold mb-1 block">Nouveau mot de passe</label>
                            <input 
                                type="password" 
                                name="newPassword" 
                                className="form-input" 
                                value={formValues.newPassword || ''} 
                                onChange={handleChange} 
                                
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Laissez vide si vous ne souhaitez pas modifier votre mot de passe
                            </p>
                        </div>
                    )}

                    {/* --- SECTION : COLLABORATEUR UNIQUEMENT --- */}
                    {profile.role === "COLLABORATEUR" && (
                        <>
                            <div className="md:col-span-2 border-b border-white-light dark:border-[#1b2e4b] pb-2 mt-4 mb-2">
                                <h5 className="font-bold text-danger">Détails Collaborateur</h5>
                            </div>
                            
                            <div className="md:col-span-1">
                                <label className="text-sm font-semibold mb-1 block">Titre du Poste</label>
                                <input name="jobTitle" className="form-input" value={formValues.jobTitle || ''} onChange={handleChange} disabled={!isEditing} placeholder="ex: Développeur React" />
                            </div>

                            <div className="md:col-span-1">
                                <label className="text-sm font-semibold mb-1 block">Années d'expérience</label>
                                <input type="number" name="yearsExperience" className="form-input" value={formValues.yearsExperience || 0} onChange={handleChange} disabled={!isEditing} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold mb-1 block">Bio / Description</label>
                                <textarea name="bio" rows={3} className="form-textarea" value={formValues.bio || ''} onChange={handleChange} disabled={!isEditing} />
                            </div>

                            <div className="md:col-span-1">
                                <label className="text-sm font-semibold mb-1 block">Lien LinkedIn</label>
                                <input name="linkedinUrl" className="form-input" value={formValues.linkedinUrl || ''} onChange={handleChange} disabled={!isEditing} />
                            </div>

                            <div className="md:col-span-1">
                                <label className="text-sm font-semibold mb-1 block">Lien GitHub</label>
                                <input name="githubUrl" className="form-input" value={formValues.githubUrl || ''} onChange={handleChange} disabled={!isEditing} />
                            </div>

                            <div className="md:col-span-2 mt-2">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" name="isPublic" className="form-checkbox text-danger" checked={formValues.isPublic || false} onChange={handleChange} disabled={!isEditing} />
                                    <span className="ml-2 text-sm font-semibold">Rendre mon profil public pour les managers</span>
                                </label>
                            </div>
                        </>
                    )}

                    {/* --- SECTION : MANAGER UNIQUEMENT --- */}
                    {profile.role === "MANAGER" && (
                        <>
                            <div className="md:col-span-2 border-b border-white-light dark:border-[#1b2e4b] pb-2 mt-4 mb-2">
                                <h5 className="font-bold text-danger">Détails Management</h5>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold mb-1 block">Département géré</label>
                                <input name="department" className="form-input" value={formValues.department || ''} onChange={handleChange} disabled={!isEditing} placeholder="ex: Département IT" />
                            </div>
                        </>
                    )}

                    {/* --- BOUTONS D'ACTION --- */}
                    <div className="md:col-span-2 flex justify-end gap-3 mt-8">
                        {!isEditing ? (
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(true)} 
                                className="btn btn-danger px-8 py-2.5 font-bold shadow-md hover:opacity-90"
                            >
                                Modifier mon profil
                            </button>
                        ) : (
                            <>
                                <button 
                                    type="button" 
                                    onClick={() => { setIsEditing(false); setPreviewUrl(profile.avatarUrl); }} 
                                    className="btn btn-outline-danger px-8"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-success px-8 text-white font-bold" 
                                    disabled={loading}
                                >
                                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;