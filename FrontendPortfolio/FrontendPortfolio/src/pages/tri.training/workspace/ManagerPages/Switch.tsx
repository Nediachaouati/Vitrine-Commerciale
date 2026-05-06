import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../../Redux/store';
import {
    BatchSwitch,
    LoadSwitchedViews,
    DeleteSwitchedView,
    FilterPortfolios,
} from '../../../../Redux/manager/actions';
import type { BatchSwitchRequestDto, PortfolioListItemDto } from '../../../../helpers/model/dto/manager.dto';
import BatchSwitchForm from './BatchSwitchForm';
import SwitchedViewsList from './SwitchedViewsList';
import { useEffect, useState } from 'react';
import ShortlistBuilder from './ManagerShortlistPage/ShortlistBuilder';

// ✅ Convertit un item Switch/Historique en PortfolioListItemDto pour ShortlistBuilder
// portfolioId est forcé en Number() car JSON peut le sérialiser en string selon l'API
const toPortfolioItem = (item: {
    portfolioId: number;
    collaboratorName: string;
    jobTitle?: string;
    switchedViewId?: number | null;
}): PortfolioListItemDto => {
    const [firstName, ...rest] = item.collaboratorName.trim().split(' ');

    // ✅ CRITIQUE : force portfolioId en number strict — évite le 500 si l'API retourne un string
    const portfolioId = Number(item.portfolioId);
    if (!portfolioId || isNaN(portfolioId)) {
        console.error('[Switch] portfolioId invalide pour', item.collaboratorName, '→', item.portfolioId);
    }

    return {
        portfolioId,
        switchedViewId: item.switchedViewId ?? null, 
        publicSlug: '',
        title: '',
        description: undefined,
        theme: '',
        language: '',
        isActive: true,
        viewCount: 0,
        createdAt: '',
        collaborator: {
            collaboratorId: 0,
            firstName: firstName ?? '',
            lastName: rest.join(' '),
            jobTitle: item.jobTitle ?? '',
            avatarUrl: undefined,
            availabilityStatus: 'not_available',
            primarySkills: [],
            yearsExperience: 0,
            badges: [],
            bio: '',
            isPublic: true,
            portfolioCount: 0,
            viewCount: 0,
        },
    };
};

const Switch = () => {
    const dispatch = useDispatch();

    const [showBuilder, setShowBuilder] = useState(false);
    const [builderItems, setBuilderItems] = useState<PortfolioListItemDto[]>([]);

    const {
        portfolios,
        loading,
        switchLoading,
        switchResult,
        switchViews,
        switchViewsLoading,
    } = useSelector((state: IRootState) => ({
        portfolios:         state.Manager.portfolios,
        loading:            state.Manager.loading,
        switchLoading:      state.Manager.switchLoading,
        switchResult:       state.Manager.switchResult,
        switchViews:        state.Manager.switchViews,
        switchViewsLoading: state.Manager.switchViewsLoading,
    }));

    useEffect(() => {
        dispatch(FilterPortfolios({}));
        dispatch(LoadSwitchedViews(undefined));
    }, [dispatch]);

    const handleSubmit = (dto: BatchSwitchRequestDto) => {
        dispatch(BatchSwitch(dto));
    };

    const handleDelete = (viewId: number) => {
        dispatch(DeleteSwitchedView(viewId));
    };

    const handleLoadViews = (tech?: string) => {
        dispatch(LoadSwitchedViews(tech));
    };

    const handleCreateSelection = (items: { portfolioId: number; collaboratorName: string; jobTitle?: string;switchedViewId?: number | null; }[]) => {
        // ✅ Filtre les items avec portfolioId invalide avant d'ouvrir le builder
        const validItems = items.filter((item) => {
            const pid = Number(item.portfolioId);
            if (!pid || isNaN(pid)) {
                console.error('[Switch] Item ignoré — portfolioId invalide:', item);
                return false;
            }
            return true;
        });

        if (validItems.length === 0) {
            console.error('[Switch] Aucun item valide à transmettre au builder');
            return;
        }

        setBuilderItems(validItems.map(toPortfolioItem));
        setShowBuilder(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Formulaire batch */}
                <div className="panel">
                    <h2 className="text-base font-semibold dark:text-white mb-4">
                        Nouveau Switch
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-danger border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <BatchSwitchForm
                            portfolios={portfolios}
                            loading={switchLoading}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>

                {/* Résultats & vues sauvegardées */}
                <div className="panel">
                    <h2 className="text-base font-semibold dark:text-white mb-4">
                        Résultats & historique
                    </h2>
                    <SwitchedViewsList
                        batchResults={switchResult?.results ?? null}
                        savedViews={switchViews}
                        savedLoading={switchViewsLoading}
                        onDelete={handleDelete}
                        onLoadViews={handleLoadViews}
                        onCreateSelection={handleCreateSelection}
                    />
                </div>
            </div>

            {/* ShortlistBuilder modal */}
            {showBuilder && (
                <ShortlistBuilder
                    onClose={() => { setShowBuilder(false); setBuilderItems([]); }}
                    preselected={builderItems}
                    startAtStep={2}
                />
            )}
        </div>
    );
};

export default Switch;