import React, { createContext, useContext, useState } from 'react';

export type Unit = 'kg' | 'lbs';

interface SettingsContextType {
    unit: Unit;
    setUnit: (unit: Unit) => void;
    toggleUnit: () => void;
    formatWeight: (weight: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

interface SettingsProviderProps {
    children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [unit, setUnit] = useState<Unit>('kg');

    const toggleUnit = () => {
        setUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
    };

    const formatWeight = (weight: number): string => {
        if (unit === 'kg') {
            return `${weight} kg`;
        } else {
            // Convert kg to lbs (1 kg = 2.20462 lbs)
            const lbs = Math.round(weight * 2.20462);
            return `${lbs} lbs`;
        }
    };

    const value = {
        unit,
        setUnit,
        toggleUnit,
        formatWeight,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}; 