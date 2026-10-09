/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  Sun, Moon, Flame, Activity, Youtube, ExternalLink, Edit2, Check, Link2,
  Wind, Power, Camera, Zap, Atom, Maximize2, Minimize2, Eye, Layers, X,
  BarChart2, Split, Sparkles, Sliders
} from 'lucide-react';
import BannerHeader from './BannerHeader';

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface SpectralLine {
  lambda: number; // in nm
  label: string;
  elementName: string;
  energyEv: number;
  frequencyThz: number;
  transition: string;
  description: string;
}

interface ChemicalItem {
  id: string;
  name: string;
  label: string;
  title: string;
  chipClass: string;
  baseColor?: ColorRGB;
  tipColor?: ColorRGB;
  coreColor?: ColorRGB;
  dotColor: string;
  spectrumNote: string;
  wavelengthLabel: string;
  primaryWavelength: number; // center visible wavelength in nm
  lines: SpectralLine[];
}

const CHEMICAL_DATA: Record<string, ChemicalItem> = {
  'Aucun': {
    id: 'Aucun',
    name: 'Aucun (Gaz standard)',
    label: 'Aucun',
    title: 'Emission thermique du milieu (Corps noir & Wien)',
    chipClass: 'chip-aucun',
    dotColor: '#0ebc5f',
    spectrumNote: 'La couleur dépend du rayonnement thermique (Loi de Planck / Wien) et de la température de combustion.',
    wavelengthLabel: 'Spectre thermique continu (Wien)',
    primaryWavelength: 590,
    lines: []
  },
  'Cuivre': {
    id: 'Cuivre',
    name: 'Cuivre (Cu²⁺)',
    label: 'Cuivre (Cu²⁺)',
    title: 'Émission atomique du Cuivre',
    chipClass: 'chip-cuivre',
    baseColor: { r: 0, g: 230, b: 180 },
    tipColor: { r: 0, g: 150, b: 255 },
    coreColor: { r: 210, g: 255, b: 240 },
    dotColor: '#00e6b4',
    spectrumNote: 'Transition électronique spectrale dans la gamme vert-bleu (~510-520 nm).',
    wavelengthLabel: 'λ = 510.5 nm & 521.8 nm (Cu I)',
    primaryWavelength: 516,
    lines: [
      { 
        lambda: 436.0, 
        label: '436.0 nm (CuCl)', 
        elementName: 'Cuivre (CuCl)',
        energyEv: 2.843, 
        frequencyThz: 687.6, 
        transition: 'Bande moléculaire CuCl (A - X)',
        description: 'Émission moléculaire de chlorure de cuivre responsable des nuances bleutées en pyrotechnie.'
      },
      { 
        lambda: 510.5, 
        label: '510.5 nm (Cu I)', 
        elementName: 'Cuivre (Cu I)',
        energyEv: 2.428, 
        frequencyThz: 587.2, 
        transition: '4p ²P°3/2 → 4s² ²D5/2',
        description: 'Raie de transition atomique neutre majeure du cuivre dans le vert émeraude.'
      },
      { 
        lambda: 521.8, 
        label: '521.8 nm (Cu I)', 
        elementName: 'Cuivre (Cu I)',
        energyEv: 2.376, 
        frequencyThz: 574.5, 
        transition: '4d ²D5/2 → 4p ²P°3/2',
        description: 'Transition atomique d\'excitation thermique intense dans le vert-turquoise.'
      },
      { 
        lambda: 535.0, 
        label: '535.0 nm (CuOH)', 
        elementName: 'Cuivre (CuOH)',
        energyEv: 2.317, 
        frequencyThz: 560.3, 
        transition: 'Bande moléculaire CuOH (vert)',
        description: 'Bande d\'hydroxyde de cuivre formée dans la flamme humide à haute température.'
      }
    ]
  },
  'Strontium': {
    id: 'Strontium',
    name: 'Strontium (Sr²⁺)',
    label: 'Strontium (Sr²⁺)',
    title: 'Émission atomique du Strontium',
    chipClass: 'chip-strontium',
    baseColor: { r: 255, g: 30, b: 60 },
    tipColor: { r: 200, g: 10, b: 40 },
    coreColor: { r: 255, g: 200, b: 210 },
    dotColor: '#ff1e3c',
    spectrumNote: 'Raies d’émission intenses dans le rouge carmin (~606-683 nm).',
    wavelengthLabel: 'λ = 606.0 nm & 659.8 - 682.8 nm (SrOH)',
    primaryWavelength: 660,
    lines: [
      { 
        lambda: 460.7, 
        label: '460.7 nm (Sr I)', 
        elementName: 'Strontium (Sr I)',
        energyEv: 2.690, 
        frequencyThz: 650.7, 
        transition: '5s5p ¹P₁ → 5s² ¹S₀',
        description: 'Raie de résonance atomique bleue du strontium neutre en spectroscopie stellaire.'
      },
      { 
        lambda: 606.0, 
        label: '606.0 nm (SrOH)', 
        elementName: 'Strontium (SrOH)',
        energyEv: 2.046, 
        frequencyThz: 494.7, 
        transition: 'Bande B²Σ⁺ → X²Σ⁺',
        description: 'Bande moléculaire émettrice d\'orange-rouge dans les fusées de détresse.'
      },
      { 
        lambda: 659.8, 
        label: '659.8 nm (SrOH)', 
        elementName: 'Strontium (SrOH)',
        energyEv: 1.879, 
        frequencyThz: 454.4, 
        transition: 'Bande A²Π → X²Σ⁺',
        description: 'Raie moléculaire maîtresse conférant la couleur rouge carmin éclatante des feux d\'artifice.'
      },
      { 
        lambda: 682.8, 
        label: '682.8 nm (SrOH)', 
        elementName: 'Strontium (SrOH)',
        energyEv: 1.816, 
        frequencyThz: 439.1, 
        transition: 'Branche A²Π1/2 → X²Σ⁺',
        description: 'Composante rouge sombre de la bande de vibration moléculaire du strontium.'
      }
    ]
  },
  'Sodium': {
    id: 'Sodium',
    name: 'Sodium (Na⁺)',
    label: 'Sodium (Na⁺)',
    title: 'Émission atomique du Sodium',
    chipClass: 'chip-sodium',
    baseColor: { r: 255, g: 195, b: 0 },
    tipColor: { r: 255, g: 130, b: 0 },
    coreColor: { r: 255, g: 245, b: 180 },
    dotColor: '#ffc300',
    spectrumNote: 'Doublet D caractéristique du Sodium à 589,0 nm et 589,6 nm (Jaune vif).',
    wavelengthLabel: 'λ = 589.0 nm (D₂) & 589.6 nm (D₁)',
    primaryWavelength: 589.3,
    lines: [
      { 
        lambda: 589.0, 
        label: '589.0 nm (D₂)', 
        elementName: 'Sodium (Na I)',
        energyEv: 2.105, 
        frequencyThz: 508.9, 
        transition: '3p ²P°3/2 → 3s ²S1/2',
        description: 'Composante principale du célèbre doublet D de Fraunhofer, utilisé dans l\'éclairage public à vapeur de sodium.'
      },
      { 
        lambda: 589.6, 
        label: '589.6 nm (D₁)', 
        elementName: 'Sodium (Na I)',
        energyEv: 2.103, 
        frequencyThz: 508.4, 
        transition: '3p ²P°1/2 → 3s ²S1/2',
        description: 'Seconde raie du doublet D séparée par couplage spin-orbite quantique (0.6 nm d\'écart).'
      }
    ]
  },
  'Potassium': {
    id: 'Potassium',
    name: 'Potassium (K⁺)',
    label: 'Potassium (K⁺)',
    title: 'Émission atomique du Potassium',
    chipClass: 'chip-potassium',
    baseColor: { r: 180, g: 120, b: 255 },
    tipColor: { r: 140, g: 60, b: 220 },
    coreColor: { r: 240, g: 220, b: 255 },
    dotColor: '#b478ff',
    spectrumNote: 'Émission principale dans le violet pâle / lilas (~404 nm) et le proche infrarouge (~766 nm).',
    wavelengthLabel: 'λ = 404.4 nm / 404.7 nm & 766.5 nm (IR)',
    primaryWavelength: 404.5,
    lines: [
      { 
        lambda: 404.4, 
        label: '404.4 nm (K I)', 
        elementName: 'Potassium (K I)',
        energyEv: 3.065, 
        frequencyThz: 741.3, 
        transition: '5p ²P°3/2 → 4s ²S1/2',
        description: 'Raie d\'émission violette caractéristique observable au travers d\'un verre au cobalt.'
      },
      { 
        lambda: 404.7, 
        label: '404.7 nm (K I)', 
        elementName: 'Potassium (K I)',
        energyEv: 3.063, 
        frequencyThz: 740.7, 
        transition: '5p ²P°1/2 → 4s ²S1/2',
        description: 'Doublet violet du potassium excité thermiquement dans la flamme.'
      },
      { 
        lambda: 766.5, 
        label: '766.5 nm (IR)', 
        elementName: 'Potassium (K I)',
        energyEv: 1.617, 
        frequencyThz: 391.1, 
        transition: '4p ²P°3/2 → 4s ²S1/2',
        description: 'Raie de résonance infrarouge lointaine extrêmement intense mais peu visible à l\'œil nu sans capteur.'
      }
    ]
  },
  'Lithium': {
    id: 'Lithium',
    name: 'Lithium (Li⁺)',
    label: 'Lithium (Li⁺)',
    title: 'Émission atomique du Lithium',
    chipClass: 'chip-lithium',
    baseColor: { r: 255, g: 20, b: 120 },
    tipColor: { r: 220, g: 0, b: 90 },
    coreColor: { r: 255, g: 200, b: 230 },
    dotColor: '#ff007f',
    spectrumNote: 'Raie de résonance ultra-pure dans le rouge carmin / magenta vif (~671 nm).',
    wavelengthLabel: 'λ = 670.8 nm (Li I - Magenta)',
    primaryWavelength: 670.8,
    lines: [
      {
        lambda: 670.8,
        label: '670.8 nm (Li I)',
        elementName: 'Lithium (Li I)',
        energyEv: 1.848,
        frequencyThz: 446.9,
        transition: '2p ²P° → 2s ²S',
        description: 'Raie de résonance atomique maîtresse du lithium conférant sa spectaculaire couleur magenta rose bonbon.'
      }
    ]
  },
  'Baryum': {
    id: 'Baryum',
    name: 'Baryum (Ba²⁺)',
    label: 'Baryum (Ba²⁺)',
    title: 'Émission atomique & moléculaire du Baryum',
    chipClass: 'chip-baryum',
    baseColor: { r: 160, g: 235, b: 40 },
    tipColor: { r: 120, g: 195, b: 20 },
    coreColor: { r: 230, g: 255, b: 180 },
    dotColor: '#84cc16',
    spectrumNote: 'Émission caractéristique dans le vert pomme / vert pâle pyrotechnique (~512-554 nm).',
    wavelengthLabel: 'λ = 512.0 nm, 524.0 nm & 553.5 nm',
    primaryWavelength: 524,
    lines: [
      {
        lambda: 512.0,
        label: '512.0 nm (BaOH)',
        elementName: 'Baryum (BaOH)',
        energyEv: 2.421,
        frequencyThz: 585.5,
        transition: 'Bande moléculaire BaOH',
        description: 'Bande d\'hydroxyde de baryum luminescente verte dans les flammes réductrices.'
      },
      {
        lambda: 524.0,
        label: '524.0 nm (BaOH)',
        elementName: 'Baryum (BaOH)',
        energyEv: 2.366,
        frequencyThz: 572.1,
        transition: 'Bande d\'émission BaOH',
        description: 'Bande verte maîtresse utilisée dans les feux d\'artifice pour le vert traditionnel.'
      },
      {
        lambda: 553.5,
        label: '553.5 nm (Ba I)',
        elementName: 'Baryum (Ba I)',
        energyEv: 2.240,
        frequencyThz: 541.6,
        transition: '6s6p ¹P₁ → 6s² ¹S₀',
        description: 'Raie de résonance atomique neutre intense du baryum dans le vert chartreuse.'
      }
    ]
  },
  'Bore': {
    id: 'Bore',
    name: 'Bore (B³⁺)',
    label: 'Bore (B³⁺)',
    title: 'Émission moléculaire de l\'Oxyde de Bore',
    chipClass: 'chip-bore',
    baseColor: { r: 16, g: 225, b: 110 },
    tipColor: { r: 5, g: 160, b: 70 },
    coreColor: { r: 200, g: 255, b: 220 },
    dotColor: '#10b981',
    spectrumNote: 'Flamme vert vif pur très éclatante produite par les radicaux d\'oxyde de bore BO₂.',
    wavelengthLabel: 'λ = 492.0 nm, 518.0 nm & 546.0 nm (BO₂)',
    primaryWavelength: 518,
    lines: [
      {
        lambda: 492.0,
        label: '492.0 nm (BO₂)',
        elementName: 'Bore (BO₂)',
        energyEv: 2.520,
        frequencyThz: 609.3,
        transition: 'Bande d\'oxyde de bore BO₂',
        description: 'Transition vibrationnelle du radical BO₂ émettant dans le vert cyan vif.'
      },
      {
        lambda: 518.0,
        label: '518.0 nm (BO₂)',
        elementName: 'Bore (BO₂)',
        energyEv: 2.393,
        frequencyThz: 578.7,
        transition: 'Bande d\'oxyde de bore BO₂',
        description: 'Pic d\'émission principal vert émeraude (caractéristique du fluide TEA-TEB des fusées SpaceX).'
      },
      {
        lambda: 546.0,
        label: '546.0 nm (BO₂)',
        elementName: 'Bore (BO₂)',
        energyEv: 2.271,
        frequencyThz: 549.1,
        transition: 'Bande BO₂ (vert herbe)',
        description: 'Composante verte supérieure du radical d\'oxyde de bore.'
      }
    ]
  },
  'Calcium': {
    id: 'Calcium',
    name: 'Calcium (Ca²⁺)',
    label: 'Calcium (Ca²⁺)',
    title: 'Émission atomique & moléculaire du Calcium',
    chipClass: 'chip-calcium',
    baseColor: { r: 245, g: 100, b: 20 },
    tipColor: { r: 200, g: 60, b: 10 },
    coreColor: { r: 255, g: 220, b: 150 },
    dotColor: '#ea580c',
    spectrumNote: 'Émission dans l\'orange brique / rouge orangé pyrotechnique (~554-622 nm).',
    wavelengthLabel: 'λ = 422.7 nm, 554.0 nm & 622.0 nm',
    primaryWavelength: 622,
    lines: [
      {
        lambda: 422.7,
        label: '422.7 nm (Ca I)',
        elementName: 'Calcium (Ca I)',
        energyEv: 2.932,
        frequencyThz: 709.2,
        transition: '4s4p ¹P₁ → 4s² ¹S₀',
        description: 'Raie de résonance violette intense du calcium atomique neutre (raie g de Fraunhofer dans le Soleil).'
      },
      {
        lambda: 554.0,
        label: '554.0 nm (CaOH)',
        elementName: 'Calcium (CaOH)',
        energyEv: 2.238,
        frequencyThz: 541.1,
        transition: 'Bande CaOH (vert-orange)',
        description: 'Bande moléculaire d\'hydroxyde de calcium produite dans les flammes standard.'
      },
      {
        lambda: 622.0,
        label: '622.0 nm (CaOH)',
        elementName: 'Calcium (CaOH)',
        energyEv: 1.993,
        frequencyThz: 482.0,
        transition: 'Bande CaOH (orange brique)',
        description: 'Bande orange dominante responsable de la couleur brique des feux de signalisation de détresse.'
      }
    ]
  },
  'Cesium': {
    id: 'Cesium',
    name: 'Césium (Cs⁺)',
    label: 'Césium (Cs⁺)',
    title: 'Émission atomique du Césium',
    chipClass: 'chip-cesium',
    baseColor: { r: 30, g: 160, b: 255 },
    tipColor: { r: 10, g: 100, b: 220 },
    coreColor: { r: 210, g: 240, b: 255 },
    dotColor: '#0ea5e9',
    spectrumNote: 'Doublet bleu ciel azur légendaire (du latin caesius = bleu ciel).',
    wavelengthLabel: 'λ = 455.5 nm & 459.3 nm (Bleu ciel)',
    primaryWavelength: 455.5,
    lines: [
      {
        lambda: 455.5,
        label: '455.5 nm (Cs I)',
        elementName: 'Césium (Cs I)',
        energyEv: 2.722,
        frequencyThz: 658.1,
        transition: '7p ²P°3/2 → 6s ²S1/2',
        description: 'Raie de résonance bleue pure qui a historiquement permis la découverte du césium en 1860 par Bunsen et Kirchhoff.'
      },
      {
        lambda: 459.3,
        label: '459.3 nm (Cs I)',
        elementName: 'Césium (Cs I)',
        energyEv: 2.699,
        frequencyThz: 652.7,
        transition: '7p ²P°1/2 → 6s ²S1/2',
        description: 'Seconde raie du doublet azur de résonance électronique du césium.'
      }
    ]
  },
  'Indium': {
    id: 'Indium',
    name: 'Indium (In³⁺)',
    label: 'Indium (In³⁺)',
    title: 'Émission atomique de l\'Indium',
    chipClass: 'chip-indium',
    baseColor: { r: 99, g: 102, b: 241 },
    tipColor: { r: 67, g: 56, b: 202 },
    coreColor: { r: 224, g: 231, b: 255 },
    dotColor: '#6366f1',
    spectrumNote: 'Raie d\'émission indigo profond caractéristique (qui a donné son nom à l\'indium).',
    wavelengthLabel: 'λ = 410.2 nm & 451.1 nm (Indigo)',
    primaryWavelength: 451.1,
    lines: [
      {
        lambda: 410.2,
        label: '410.2 nm (In I)',
        elementName: 'Indium (In I)',
        energyEv: 3.022,
        frequencyThz: 730.8,
        transition: '6s ²S1/2 → 5p ²P°1/2',
        description: 'Raie violette-indigo très vive d\'excitation thermique atomique.'
      },
      {
        lambda: 451.1,
        label: '451.1 nm (In I)',
        elementName: 'Indium (In I)',
        energyEv: 2.748,
        frequencyThz: 664.5,
        transition: '6s ²S1/2 → 5p ²P°3/2',
        description: 'Raie bleue-indigo caractéristique découverte par Reich et Richter en 1863.'
      }
    ]
  },
  'Rubidium': {
    id: 'Rubidium',
    name: 'Rubidium (Rb⁺)',
    label: 'Rubidium (Rb⁺)',
    title: 'Émission atomique du Rubidium',
    chipClass: 'chip-rubidium',
    baseColor: { r: 195, g: 30, b: 180 },
    tipColor: { r: 150, g: 15, b: 140 },
    coreColor: { r: 250, g: 190, b: 245 },
    dotColor: '#c026d3',
    spectrumNote: 'Flamme rouge-violette pourpre intense (du latin rubidus = rouge sombre / pourpre).',
    wavelengthLabel: 'λ = 420.2 nm, 421.6 nm & 780.0 nm (Rb I)',
    primaryWavelength: 420.2,
    lines: [
      {
        lambda: 420.2,
        label: '420.2 nm (Rb I)',
        elementName: 'Rubidium (Rb I)',
        energyEv: 2.950,
        frequencyThz: 713.4,
        transition: '6p ²P°3/2 → 5s ²S1/2',
        description: 'Raie violette de résonance électronique majeure du rubidium neutre.'
      },
      {
        lambda: 421.6,
        label: '421.6 nm (Rb I)',
        elementName: 'Rubidium (Rb I)',
        energyEv: 2.940,
        frequencyThz: 711.0,
        transition: '6p ²P°1/2 → 5s ²S1/2',
        description: 'Composante du doublet violet séparée par couplage spin-orbite de l\'atome de rubidium.'
      },
      {
        lambda: 780.0,
        label: '780.0 nm (D₂)',
        elementName: 'Rubidium (Rb I)',
        energyEv: 1.589,
        frequencyThz: 384.3,
        transition: '5p ²P°3/2 → 5s ²S1/2',
        description: 'Raie de résonance D₂ dans le rouge profond / proche infrarouge, fondamentale pour les horloges atomiques et le refroidissement laser.'
      },
      {
        lambda: 794.8,
        label: '794.8 nm (D₁)',
        elementName: 'Rubidium (Rb I)',
        energyEv: 1.560,
        frequencyThz: 377.2,
        transition: '5p ²P°1/2 → 5s ²S1/2',
        description: 'Seconde raie D₁ du rubidium neutre dans le rouge sombre.'
      }
    ]
  },
  'Thallium': {
    id: 'Thallium',
    name: 'Thallium (Tl⁺)',
    label: 'Thallium (Tl⁺)',
    title: 'Émission atomique du Thallium',
    chipClass: 'chip-thallium',
    baseColor: { r: 16, g: 245, b: 140 },
    tipColor: { r: 5, g: 180, b: 90 },
    coreColor: { r: 210, g: 255, b: 230 },
    dotColor: '#05df72',
    spectrumNote: 'Flamme vert émeraude électrique pur éclatant (du grec thallos = jeune pousse verte éclatante).',
    wavelengthLabel: 'λ = 377.6 nm & 535.0 nm (Vert pur)',
    primaryWavelength: 535.0,
    lines: [
      {
        lambda: 377.6,
        label: '377.6 nm (Tl I)',
        elementName: 'Thallium (Tl I)',
        energyEv: 3.283,
        frequencyThz: 793.9,
        transition: '7s ²S1/2 → 6p ²P°1/2',
        description: 'Transition atomique limite proche UV - violette du thallium neutre.'
      },
      {
        lambda: 535.0,
        label: '535.0 nm (Tl I)',
        elementName: 'Thallium (Tl I)',
        energyEv: 2.317,
        frequencyThz: 560.3,
        transition: '7s ²S1/2 → 6p ²P°3/2',
        description: 'Célèbre raie vert émeraude pure découverte par Sir William Crookes en 1861 qui a donné son nom au thallium.'
      }
    ]
  },
  'Plomb': {
    id: 'Plomb',
    name: 'Plomb (Pb²⁺)',
    label: 'Plomb (Pb²⁺)',
    title: 'Émission atomique du Plomb',
    chipClass: 'chip-plomb',
    baseColor: { r: 165, g: 185, b: 230 },
    tipColor: { r: 120, g: 140, b: 195 },
    coreColor: { r: 235, g: 242, b: 255 },
    dotColor: '#93c5fd',
    spectrumNote: 'Flamme bleu-gris acier pâle / blanc bleuté caractéristique des vapeurs de plomb.',
    wavelengthLabel: 'λ = 368.3 nm & 405.8 nm (Bleu-gris)',
    primaryWavelength: 405.8,
    lines: [
      {
        lambda: 368.3,
        label: '368.3 nm (Pb I)',
        elementName: 'Plomb (Pb I)',
        energyEv: 3.366,
        frequencyThz: 814.0,
        transition: '7s ³P₀ → 6p² ³P₁',
        description: 'Raie atomique de transition électronique UV/violette du plomb neutre.'
      },
      {
        lambda: 405.8,
        label: '405.8 nm (Pb I)',
        elementName: 'Plomb (Pb I)',
        energyEv: 3.055,
        frequencyThz: 738.7,
        transition: '7s ³P₁ → 6p² ³P₂',
        description: 'Raie de résonance principale dans le violet-bleu acier visible.'
      }
    ]
  },
  'Fer': {
    id: 'Fer',
    name: 'Fer (Fe / Fe³⁺)',
    label: 'Fer (Fe / Fe³⁺)',
    title: 'Émission atomique du Fer & Scintillement pyrotechnique',
    chipClass: 'chip-fer',
    baseColor: { r: 245, g: 158, b: 11 },
    tipColor: { r: 217, g: 119, b: 6 },
    coreColor: { r: 254, g: 243, b: 199 },
    dotColor: '#f59e0b',
    spectrumNote: 'Flamme ambre dorée avec étincelles scintillantes (utilisé dans les feux d\'artifice et cierges magiques).',
    wavelengthLabel: 'λ = 372.0 nm, 382.0 nm & 438.3 nm (Fe I)',
    primaryWavelength: 438.3,
    lines: [
      {
        lambda: 372.0,
        label: '372.0 nm (Fe I)',
        elementName: 'Fer (Fe I)',
        energyEv: 3.332,
        frequencyThz: 805.9,
        transition: 'z ⁵F°5 → a ⁵D4',
        description: 'Raie maîtresse du multiplet dense de résonance du fer neutre.'
      },
      {
        lambda: 382.0,
        label: '382.0 nm (Fe I)',
        elementName: 'Fer (Fe I)',
        energyEv: 3.245,
        frequencyThz: 784.8,
        transition: 'z ⁵D°4 → a ⁵D4',
        description: 'Transition électronique d\'excitation thermique intense dans le violet.'
      },
      {
        lambda: 438.3,
        label: '438.3 nm (Fe I)',
        elementName: 'Fer (Fe I)',
        energyEv: 2.828,
        frequencyThz: 683.9,
        transition: 'z ⁵G°6 → a ⁵F5',
        description: 'Raie d\'émission bleue-dorée caractéristique du fer excité.'
      },
      {
        lambda: 527.0,
        label: '527.0 nm (Fe I)',
        elementName: 'Fer (Fe I)',
        energyEv: 2.352,
        frequencyThz: 568.9,
        transition: 'z ³F°4 → a ³F4',
        description: 'Raie E de Fraunhofer observée en absorption dans le spectre solaire et en émission dans la flamme.'
      }
    ]
  },
  'Antimoine': {
    id: 'Antimoine',
    name: 'Antimoine (Sb³⁺)',
    label: 'Antimoine (Sb³⁺)',
    title: 'Émission atomique de l\'Antimoine',
    chipClass: 'chip-antimoine',
    baseColor: { r: 160, g: 240, b: 210 },
    tipColor: { r: 110, g: 200, b: 170 },
    coreColor: { r: 230, g: 255, b: 248 },
    dotColor: '#5eead4',
    spectrumNote: 'Flamme vert céladon givré / vert opalescent pâle très distincte.',
    wavelengthLabel: 'λ = 403.3 nm & 573.0 nm (Céladon)',
    primaryWavelength: 573.0,
    lines: [
      {
        lambda: 403.3,
        label: '403.3 nm (Sb I)',
        elementName: 'Antimoine (Sb I)',
        energyEv: 3.074,
        frequencyThz: 743.3,
        transition: '6s ⁴P1/2 → 5p³ ⁴S°3/2',
        description: 'Raie violette d\'excitation électronique de l\'antimoine neutre.'
      },
      {
        lambda: 573.0,
        label: '573.0 nm (Sb I)',
        elementName: 'Antimoine (Sb I)',
        energyEv: 2.163,
        frequencyThz: 523.2,
        transition: '6s ²P1/2 → 5p³ ²D°3/2',
        description: 'Raie vert-jaune pâle opalescente conférant la teinte céladon caractéristique.'
      }
    ]
  }
};

class Particle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  life: number = 0;
  maxLife: number = 50;
  size: number = 16;
  chemicalKey: string = 'Aucun';

  constructor(x: number, y: number, temp: number, airRatio: number, chem: string) {
    this.reset(x, y, temp, airRatio, chem);
  }

  reset(x: number, y: number, temp: number, airRatio: number, chem: string, heightScale: number = 1.0) {
    // Air ratio narrows the flame base and accelerates upward flow
    const baseSpread = 26 * (1.3 - airRatio * 0.5) * Math.min(1.25, heightScale);
    this.x = x + (Math.random() - 0.5) * baseSpread;
    this.y = y;
    this.vx = (Math.random() - 0.5) * (0.8 + (1 - airRatio) * 0.4);
    
    const tempFactor = (temp - 500) / 1500;
    const airVelocityBoost = airRatio * 1.6;
    this.vy = -(2.0 + tempFactor * 2.8 + airVelocityBoost + Math.random() * 1.5) * Math.min(1.4, heightScale);
    
    this.life = 0;
    this.maxLife = (32 + Math.random() * 24 + tempFactor * 16) * Math.min(1.3, heightScale);
    this.size = (13 + Math.random() * 15 + tempFactor * 5) * (1.2 - airRatio * 0.35) * Math.min(1.2, heightScale);
    this.chemicalKey = chem;
  }

  update(x: number, y: number, temp: number, airRatio: number, chem: string, heightScale: number = 1.0) {
    this.x += this.vx + Math.sin(this.life * 0.16) * (0.6 + (1 - airRatio) * 0.5);
    this.y += this.vy;
    this.life++;
    this.size *= 0.962;

    if (this.life >= this.maxLife || this.size < 1) {
      this.reset(x, y, temp, airRatio, chem, heightScale);
    }
  }
}

class SparkParticle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  life: number = 0;
  maxLife: number = 25;
  color: string = '#ffffff';

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2;
    this.maxLife = 15 + Math.floor(Math.random() * 15);
    this.color = Math.random() > 0.4 ? '#38bdf8' : '#ffffff';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.25; // gravity
    this.life++;
  }
}

function getThermalColor(temp: number, airRatio: number) {
  // Air intake makes combustion hotter and shifts toward blue
  const adjustedTemp = temp + airRatio * 250;

  if (adjustedTemp < 800) {
    const ratio = Math.max(0, (adjustedTemp - 500) / 300);
    return {
      base: { r: Math.round(180 + ratio * 55), g: Math.round(30 + ratio * 30), b: 10 },
      tip: { r: Math.round(100 + ratio * 40), g: 10, b: 5 },
      core: { r: 255, g: Math.round(100 + ratio * 50), b: 50 },
      dot: '#e63946'
    };
  } else if (adjustedTemp < 1000) {
    const ratio = (adjustedTemp - 800) / 200;
    return {
      base: { r: 240, g: Math.round(80 + ratio * 60), b: 15 },
      tip: { r: 200, g: Math.round(40 + ratio * 40), b: 10 },
      core: { r: 255, g: Math.round(180 + ratio * 40), b: 80 },
      dot: '#f77f00'
    };
  } else if (adjustedTemp < 1400) {
    const ratio = (adjustedTemp - 1000) / 400;
    return {
      base: { r: 255, g: Math.round(180 + ratio * 50), b: Math.round(20 + ratio * 30) },
      tip: { r: 230, g: Math.round(120 + ratio * 60), b: 15 },
      core: { r: 255, g: 245, b: Math.round(140 + ratio * 60) },
      dot: '#ffb703'
    };
  } else if (adjustedTemp < 1600) {
    const ratio = (adjustedTemp - 1400) / 200;
    return {
      base: { r: Math.round(240 - ratio * 40), g: Math.round(230 - ratio * 20), b: Math.round(150 + ratio * 80) },
      tip: { r: 255, g: 200, b: Math.round(50 + ratio * 100) },
      core: { r: 255, g: 255, b: 240 },
      dot: '#fff3b0'
    };
  } else {
    const ratio = Math.min(1, (adjustedTemp - 1600) / 400);
    return {
      base: { r: Math.round(50 - ratio * 30), g: Math.round(140 + ratio * 60), b: 255 },
      tip: { r: 20, g: Math.round(60 + ratio * 40), b: 220 },
      core: { r: 200, g: 235, b: 255 },
      dot: '#3a86ff'
    };
  }
}

/**
 * Conversion physique de la longueur d'onde optique (380 - 780 nm)
 * vers sa couleur chromatique réelle (RGB / Hex) et sa dénomination spectrale.
 * Algorithme basé sur la modélisation CIE 1931 / Dan Bruton des raies d'émission.
 */
function wavelengthToColor(wavelength: number): { hex: string; rgb: string; r: number; g: number; b: number; name: string } {
  let r = 0, g = 0, b = 0;
  let name = '';

  if (wavelength < 380) {
    // Proche UV
    r = 0.55;
    g = 0.1;
    b = 0.85;
    name = 'Proche Ultraviolet (UV)';
  } else if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
    name = 'Violet';
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
    name = wavelength < 470 ? 'Indigo / Bleu profond' : 'Bleu cyan';
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
    name = 'Cyan / Turquoise';
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
    name = wavelength < 545 ? 'Vert émeraude' : 'Vert chartreuse';
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
    name = wavelength < 600 ? 'Jaune d\'or (Doublet D)' : 'Orange vif';
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1;
    g = 0;
    b = 0;
    name = wavelength < 690 ? 'Rouge carmin' : 'Rouge profond';
  } else {
    // Proche IR
    r = 0.85;
    g = 0.05;
    b = 0.05;
    name = 'Proche Infrarouge (IR)';
  }

  // Facteur d'atténuation aux limites de sensibilité de l'œil humain
  let factor = 1.0;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.45 + 0.55 * ((wavelength - 380) / (420 - 380));
  } else if (wavelength >= 700 && wavelength <= 780) {
    factor = 0.45 + 0.55 * ((780 - wavelength) / (780 - 700));
  } else if (wavelength > 780) {
    factor = 0.4;
  } else if (wavelength < 380) {
    factor = 0.45;
  }

  const R = Math.min(255, Math.max(0, Math.round(r * factor * 255)));
  const G = Math.min(255, Math.max(0, Math.round(g * factor * 255)));
  const B = Math.min(255, Math.max(0, Math.round(b * factor * 255)));
  const hex = `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;

  return {
    hex,
    rgb: `rgb(${R}, ${G}, ${B})`,
    r: R,
    g: G,
    b: B,
    name
  };
}

/**
 * Raies et bandes d'émission réelles des radicaux libres de combustion d'hydrocarbures
 * Conférant à la flamme de prémélange du bec Bunsen sa couleur bleue-violette caractéristique (Chimiluminescence)
 */
const BUNSEN_RADICAL_LINES: SpectralLine[] = [
  {
    lambda: 431.4,
    label: '431.4 nm (CH*)',
    elementName: 'Radical Méthyle excité (CH*)',
    energyEv: 2.874,
    frequencyThz: 694.9,
    transition: 'A ²Δ → X ²Π (Bande 4300 Å)',
    description: 'Chimiluminescence du radical CH* conférant sa couleur bleue-violette au cône de réaction primaire du dard interne.'
  },
  {
    lambda: 516.5,
    label: '516.5 nm (C₂ Swan)',
    elementName: 'Carbone diatomique (C₂ Bandes de Swan)',
    energyEv: 2.400,
    frequencyThz: 580.4,
    transition: 'd ³Πg → a ³Πu (Bandes de Swan)',
    description: 'Bandes d\'émission moléculaire des dimères de carbone C₂ excités lors de la réaction de combustion vive de l\'hydrocarbure.'
  }
];

/**
 * Garantit un contraste d'accessibilité optimal (WCAG AA/AAA) pour le mode clair.
 * Évite les jaunes trop clairs, pastels ou blanchâtres illisibles sur fond clair.
 */
function getAccessibleColor(color: string, isLight: boolean): string {
  if (!isLight) return color;
  const col = color.toLowerCase();
  const contrastMap: Record<string, string> = {
    '#fff3b0': '#b45309', // Blanc-jaune trop clair -> Ambre doré soutenu (5.7:1)
    '#ffb703': '#b45309', // Jaune vif -> Ambre doré soutenu (5.7:1)
    '#ffc300': '#b45309', // Sodium jaune -> Ambre foncé (5.7:1)
    '#facc15': '#b45309', // Jaune 400 -> Ambre foncé (5.7:1)
    '#fde047': '#a16207', // Jaune 300 -> Or ambré soutenu (5.4:1)
    '#fef08a': '#a16207', // Jaune clair -> Or ambré soutenu (5.4:1)
    '#eab308': '#a16207', // Jaune 500 -> Or ambré soutenu (5.4:1)
    '#f59e0b': '#b45309', // Ambre 500 -> Ambre foncé (5.7:1)
    '#0ebc5f': '#047857', // Vert émeraude -> Vert foncé (4.8:1)
    '#00e6b4': '#0f766e', // Cuivre turquoise -> Sarcelle foncé (4.9:1)
    '#5eead4': '#0f766e', // Turquoise clair -> Sarcelle foncé (4.9:1)
    '#84cc16': '#4d7c0f', // Lime -> Olive foncée (4.6:1)
    '#93c5fd': '#1d4ed8', // Bleu pastel -> Bleu royal (7.2:1)
    '#38bdf8': '#0284c7', // Bleu ciel -> Bleu cyan soutenu (4.7:1)
    '#3a86ff': '#1d4ed8', // Bleu vif -> Bleu royal foncé (7.2:1)
  };
  return contrastMap[col] || color;
}

export default function App() {
  const [temperature, setTemperature] = useState<number>(1000);
  const [chemicalElement, setChemicalElement] = useState<string>('Aucun');
  
  // NEW LAB REALISM CONTROLS
  const [isIgnited, setIsIgnited] = useState<boolean>(true);
  const [airIntake, setAirIntake] = useState<number>(50); // 0% closed, 100% full O2
  const [isThermalCoupled, setIsThermalCoupled] = useState<boolean>(true); // Dynamic physical coupling
  const [burnerEnvironment, setBurnerEnvironment] = useState<'room' | 'chamber'>('room'); // 'room' = Paillasse libre (flamme de sécurité à 0%), 'chamber' = Enceinte close (asphyxie à 0%)
  const [useCobaltGlass, setUseCobaltGlass] = useState<boolean>(false); // Filtre optique au verre de cobalt (absorption du sodium 589 nm)
  const [cobaltSplitView, setCobaltSplitView] = useState<boolean>(true); // Mode comparaison split 50/50 pour le verre de cobalt
  const [hasSampleLoop, setHasSampleLoop] = useState<boolean>(true); // Anse en fil de platine (porte-échantillon de sel de laboratoire)
  const [spectroView, setSpectroView] = useState<'both' | 'diffraction' | 'profile'>('both'); // Affichage raies de diffraction vs profil CCD I(λ)
  const [isMixMode, setIsMixMode] = useState<boolean>(false);
  const [mixedElements, setMixedElements] = useState<string[]>(['Aucun']);
  const [spectrumMode, setSpectrumMode] = useState<'emission' | 'absorption'>('emission');
  const [selectedQuantumLine, setSelectedQuantumLine] = useState<SpectralLine | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState<boolean>(false);

  // Dynamic handlers for thermal and air collar coupling
  const handleAirChange = (newAir: number) => {
    setAirIntake(newAir);
    if (newAir === 0) {
      if (burnerEnvironment === 'chamber') {
        // Enceinte close étanche : absence totale de comburant -> flamme éteinte par asphyxie (Triangle du feu)
        setIsIgnited(false);
        if (isThermalCoupled) {
          setTemperature(500);
        }
      } else {
        // Paillasse à l'air libre : le gaz brûle avec l'air ambiant secondaire au sommet du tube
        // Flamme de sécurité jaune de laboratoire (~500°C, suie fuligineuse)
        setIsIgnited(true);
        if (isThermalCoupled) {
          setTemperature(500);
        }
      }
    } else {
      if (isThermalCoupled) {
        // Bunsen burner thermodynamic curve:
        // 5% air -> ~565°C, 50% air -> ~1175°C, 100% air -> ~1850°C
        const newTemp = Math.round(500 + (newAir / 100) * 1350);
        setTemperature(newTemp);
      }
    }
  };

  const handleTempChange = (newTemp: number) => {
    setTemperature(newTemp);
    if (isThermalCoupled) {
      // Calculate required air collar opening (minimum 5% to sustain combustion)
      const calculatedAir = Math.min(100, Math.max(5, Math.round(((newTemp - 500) / 1350) * 100)));
      setAirIntake(calculatedAir);
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Social Links State (Persistent)
  const [youtubeUrl, setYoutubeUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('social_youtube_url') || 'https://www.youtube.com/@FrappesCerebrales';
    }
    return 'https://www.youtube.com/@FrappesCerebrales';
  });
  const [tiktokUrl, setTiktokUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('social_tiktok_url') || 'https://www.tiktok.com/@frappescerebrales';
    }
    return 'https://www.tiktok.com/@frappescerebrales';
  });
  const [isEditingSocials, setIsEditingSocials] = useState<boolean>(false);
  const [draftYoutube, setDraftYoutube] = useState<string>(youtubeUrl);
  const [draftTiktok, setDraftTiktok] = useState<string>(tiktokUrl);

  const saveSocialLinks = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setYoutubeUrl(draftYoutube);
    setTiktokUrl(draftTiktok);
    try {
      localStorage.setItem('social_youtube_url', draftYoutube);
      localStorage.setItem('social_tiktok_url', draftTiktok);
    } catch {}
    setIsEditingSocials(false);
  };

  // Exact Logo State with versioning to guarantee browser cache bypass
  const OFFICIAL_LOGO_SRC = '/logo.png?v=cutout_transp_v2';
  const [exactLogo, setExactLogo] = useState<string | null>(() => {
    return OFFICIAL_LOGO_SRC;
  });
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Check if user had a locally uploaded image
    const saved = localStorage.getItem('user_logo_image');
    if (saved && saved.startsWith('data:image/')) {
      // User has custom uploaded image
      setExactLogo(saved);
      return;
    }

    // Otherwise load the official transparent cutout image from /public/logo.png
    const img = new Image();
    img.src = OFFICIAL_LOGO_SRC;
    img.onload = () => {
      setExactLogo(OFFICIAL_LOGO_SRC);
    };
    img.onerror = () => {
      if (saved) setExactLogo(saved);
    };
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setExactLogo(result);
          try {
            localStorage.setItem('user_logo_image', result);
          } catch {}
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<SparkParticle[]>([]);
  const stateRef = useRef({ 
    temperature, 
    chemicalElement, 
    isIgnited, 
    airIntake, 
    isMixMode, 
    mixedElements,
    useCobaltGlass,
    cobaltSplitView,
    hasSampleLoop,
    burnerEnvironment,
    isFullscreen
  });

  // Keep stateRef up to date for canvas animation loop
  useEffect(() => {
    stateRef.current = { 
      temperature, 
      chemicalElement, 
      isIgnited, 
      airIntake, 
      isMixMode, 
      mixedElements, 
      useCobaltGlass,
      cobaltSplitView,
      hasSampleLoop,
      burnerEnvironment,
      isFullscreen
    };
  }, [temperature, chemicalElement, isIgnited, airIntake, isMixMode, mixedElements, useCobaltGlass, cobaltSplitView, hasSampleLoop, burnerEnvironment, isFullscreen]);

  // Escape key listener for exiting fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Synchronize Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  // Listen for host set-theme messages
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data && (e.data.type === 'set-theme' || e.data.type === 'APPLY_THEME') && e.data.theme) {
        if (e.data.theme === 'dark' || e.data.theme === 'light') {
          setTheme(e.data.theme);
        }
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Piezo spark ignition effect
  const triggerPiezoIgnition = () => {
    // If air intake is 0, supply minimum air (20%) so oxygen comburant is present to sustain flame
    if (airIntake === 0) {
      setAirIntake(20);
      if (isThermalCoupled) {
        setTemperature(770);
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    // Spawn 24 piezo sparks at burner tip
    const newSparks: SparkParticle[] = [];
    for (let i = 0; i < 24; i++) {
      newSparks.push(new SparkParticle(width / 2, height - 38));
    }
    sparksRef.current = newSparks;
    setIsIgnited(true);
  };

  // Toggle chemical selection in single vs mix mode
  const handleChemicalClick = (elemKey: string) => {
    if (!isMixMode) {
      setChemicalElement(elemKey);
      setMixedElements([elemKey]);
    } else {
      if (elemKey === 'Aucun') {
        setChemicalElement('Aucun');
        setMixedElements(['Aucun']);
      } else {
        const withoutNone = mixedElements.filter(e => e !== 'Aucun');
        let updated: string[];
        if (withoutNone.includes(elemKey)) {
          updated = withoutNone.filter(e => e !== elemKey);
          if (updated.length === 0) updated = ['Aucun'];
        } else {
          updated = [...withoutNone, elemKey];
        }
        setMixedElements(updated);
        setChemicalElement(updated[updated.length - 1]);
      }
    }
  };

  // Flame particle animation canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const NUM_PARTICLES = 95;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const p = new Particle(0, 0, stateRef.current.temperature, stateRef.current.airIntake / 100, 'Aucun');
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }

    let animId: number;

    const render = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || 500;
      const height = parent?.clientHeight || 280;
      const dpr = window.devicePixelRatio || 1;

      const targetW = Math.floor(width * dpr);
      const targetH = Math.floor(height * dpr);
      const sizeChanged = (canvas.width !== targetW || canvas.height !== targetH);
      if (sizeChanged) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background reset
      ctx.fillStyle = '#090b10';
      ctx.fillRect(0, 0, width, height);

      const burnerX = width / 2;
      const burnerY = height - 38;
      const airRatio = stateRef.current.airIntake / 100;
      const ignited = stateRef.current.isIgnited;

      // Scale factor for flame height in tall or fullscreen canvas
      const heightScale = Math.max(1.0, Math.min(1.5, height / 280));

      if (sizeChanged) {
        for (let i = 0; i < particles.length; i++) {
          particles[i].reset(burnerX, burnerY - 6, stateRef.current.temperature, airRatio, stateRef.current.chemicalElement, heightScale);
        }
      }

      // 1. LAB WORKBENCH TABLETOP (Paillasse de laboratoire en résine noire mate)
      const benchY = burnerY + 22;
      const benchGrad = ctx.createLinearGradient(0, benchY, 0, height);
      benchGrad.addColorStop(0, '#161a25');
      benchGrad.addColorStop(0.12, '#0c0f16');
      benchGrad.addColorStop(1, '#050609');
      ctx.fillStyle = benchGrad;
      ctx.fillRect(0, benchY, width, Math.max(10, height - benchY));

      // Workbench horizon bevel line
      ctx.strokeStyle = '#273347';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, benchY);
      ctx.lineTo(width, benchY);
      ctx.stroke();

      // Render sparks if active
      if (sparksRef.current.length > 0) {
        ctx.save();
        for (let i = sparksRef.current.length - 1; i >= 0; i--) {
          const s = sparksRef.current[i];
          s.update();
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8;
          ctx.fillRect(s.x, s.y, 2, 2);
          if (s.life >= s.maxLife) {
            sparksRef.current.splice(i, 1);
          }
        }
        ctx.restore();
      }

      // If burner is extinguished, draw cold burner and notice
      if (!ignited) {
        // Cold Burner Base Foot
        const baseGradCold = ctx.createLinearGradient(burnerX - 44, benchY - 10, burnerX + 44, benchY);
        baseGradCold.addColorStop(0, '#10141d');
        baseGradCold.addColorStop(0.5, '#222938');
        baseGradCold.addColorStop(1, '#121620');
        ctx.fillStyle = baseGradCold;
        ctx.beginPath();
        ctx.moveTo(burnerX - 40, benchY);
        ctx.lineTo(burnerX - 30, benchY - 10);
        ctx.lineTo(burnerX + 30, benchY - 10);
        ctx.lineTo(burnerX + 40, benchY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#333f52';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Gas Hose
        ctx.strokeStyle = '#181e28';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(burnerX + 30, benchY - 5);
        ctx.bezierCurveTo(burnerX + 48, benchY - 5, burnerX + 65, benchY + 5, width + 10, benchY + 5);
        ctx.stroke();

        // Burner Tube
        const tubeGradCold = ctx.createLinearGradient(burnerX - 10, 0, burnerX + 10, 0);
        tubeGradCold.addColorStop(0, '#171d28');
        tubeGradCold.addColorStop(0.5, '#404c63');
        tubeGradCold.addColorStop(1, '#1a202d');
        ctx.fillStyle = tubeGradCold;
        ctx.fillRect(burnerX - 10, burnerY - 6, 20, 36);

        // Notice
        ctx.save();
        ctx.textAlign = 'center';
        if (airRatio === 0) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
          ctx.font = 'bold 12px var(--ff-mono)';
          ctx.fillText('FLAMME ÉTOUFFÉE — 0% O₂ (MANQUE TOTAL DE COMBURANT)', burnerX, burnerY - 50);
          ctx.fillStyle = 'rgba(248, 113, 113, 0.8)';
          ctx.font = '11px var(--ff-sans)';
          ctx.fillText('Ouvrez la virole d\'air (> 0%) et actionnez le Piezo pour rallumer', burnerX, burnerY - 32);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.font = 'bold 12px var(--ff-mono)';
          ctx.fillText('BRÛLEUR ÉTEINT — CLIQUEZ SUR ALLUMER (PIEZO)', burnerX, burnerY - 45);
        }
        ctx.restore();
        animId = requestAnimationFrame(render);
        return;
      }

      // Determine active palette based on single or mixed chemical elements
      const currentMix = stateRef.current.isMixMode ? stateRef.current.mixedElements : [stateRef.current.chemicalElement];
      const activeChems = currentMix.filter(e => e !== 'Aucun');

      // Primary color palette
      let colorPalette: { base: ColorRGB; tip: ColorRGB; core: ColorRGB; dot: string };
      const currentTemp = stateRef.current.temperature;

      if (activeChems.length > 0) {
        const primaryElem = activeChems[0];
        const chem = CHEMICAL_DATA[primaryElem];
        colorPalette = {
          base: chem.baseColor || { r: 255, g: 195, b: 0 },
          tip: chem.tipColor || { r: 255, g: 130, b: 0 },
          core: chem.coreColor || { r: 255, g: 245, b: 180 },
          dot: chem.dotColor
        };
      } else {
        colorPalette = getThermalColor(currentTemp, airRatio);
      }

      const cBase = colorPalette.base;

      // Dynamic tabletop specular reflection of flame light
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const reflGrad = ctx.createRadialGradient(burnerX, benchY + 6, 2, burnerX, benchY + 10, 120);
      reflGrad.addColorStop(0, `rgba(${cBase.r}, ${cBase.g}, ${cBase.b}, 0.35)`);
      reflGrad.addColorStop(0.55, `rgba(${cBase.r}, ${cBase.g}, ${cBase.b}, 0.10)`);
      reflGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = reflGrad;
      ctx.beginPath();
      ctx.ellipse(burnerX, benchY + 8, 120, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. REALISTIC BUNSEN BURNER DRAWING
      // Cast-Iron Burner Base (Pied lourd en fonte d'acier)
      const baseGrad = ctx.createLinearGradient(burnerX - 44, benchY - 10, burnerX + 44, benchY);
      baseGrad.addColorStop(0, '#10141d');
      baseGrad.addColorStop(0.3, '#2a3447');
      baseGrad.addColorStop(0.5, '#3b4860');
      baseGrad.addColorStop(0.8, '#202836');
      baseGrad.addColorStop(1, '#0e1219');
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.moveTo(burnerX - 42, benchY);
      ctx.lineTo(burnerX - 32, benchY - 10);
      ctx.lineTo(burnerX + 32, benchY - 10);
      ctx.lineTo(burnerX + 42, benchY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#43526c';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Gas Hose Barb Nipple (Olive en laiton)
      const nippleX = burnerX + 28;
      const nippleY = benchY - 6;
      ctx.fillStyle = '#b45309';
      ctx.fillRect(nippleX, nippleY - 2.5, 9, 5);

      // Flexible Rubber Gas Tube (Tuyau Bunsen souple)
      ctx.strokeStyle = '#1a202c';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(nippleX + 9, nippleY);
      ctx.bezierCurveTo(nippleX + 30, nippleY, nippleX + 50, benchY + 5, width + 10, benchY + 5);
      ctx.stroke();

      // Stainless Steel / Brass Burner Chimney (Fût métallique du brûleur)
      const tubeW = 20;
      const tubeH = 34;
      const tubeGrad = ctx.createLinearGradient(burnerX - tubeW / 2, 0, burnerX + tubeW / 2, 0);
      tubeGrad.addColorStop(0, '#1b212f');
      tubeGrad.addColorStop(0.25, '#4b5770');
      tubeGrad.addColorStop(0.5, '#7f8ea8'); // Specular highlight
      tubeGrad.addColorStop(0.75, '#2e384b');
      tubeGrad.addColorStop(1, '#171c26');
      ctx.fillStyle = tubeGrad;
      ctx.fillRect(burnerX - tubeW / 2, burnerY - 5, tubeW, tubeH);
      ctx.strokeStyle = '#445169';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(burnerX - tubeW / 2, burnerY - 5, tubeW, tubeH);

      // Top Nozzle Rim Ring (Bague supérieure de sortie de gaz)
      const nozzleGrad = ctx.createLinearGradient(burnerX - 12, 0, burnerX + 12, 0);
      nozzleGrad.addColorStop(0, '#313d52');
      nozzleGrad.addColorStop(0.5, '#94a3b8');
      nozzleGrad.addColorStop(1, '#1f2838');
      ctx.fillStyle = nozzleGrad;
      ctx.fillRect(burnerX - 12, burnerY - 8, 24, 4);

      // Rotary Knurled Air Collar (Virole rotative)
      const collarY = burnerY + 7;
      const collarW = 28;
      const collarH = 13;
      const collarGrad = ctx.createLinearGradient(burnerX - collarW / 2, 0, burnerX + collarW / 2, 0);
      collarGrad.addColorStop(0, '#111724');
      collarGrad.addColorStop(0.3, '#334057');
      collarGrad.addColorStop(0.5, '#5c6d8a');
      collarGrad.addColorStop(0.8, '#242e40');
      collarGrad.addColorStop(1, '#0c101a');
      ctx.fillStyle = collarGrad;
      ctx.fillRect(burnerX - collarW / 2, collarY, collarW, collarH);
      ctx.strokeStyle = '#435169';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(burnerX - collarW / 2, collarY, collarW, collarH);

      // Knurling ridges (Stries métalliques de la virole)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1;
      for (let k = -collarW / 2 + 3; k < collarW / 2 - 2; k += 3.5) {
        ctx.beginPath();
        ctx.moveTo(burnerX + k, collarY + 1);
        ctx.lineTo(burnerX + k, collarY + collarH - 1);
        ctx.stroke();
      }

      // Air Aperture Vents (Fenêtres d'air)
      const holeW = Math.max(1.5, 8.5 * airRatio);
      ctx.fillStyle = '#05070d';
      ctx.fillRect(burnerX - 10, collarY + 3, holeW, 7);
      ctx.fillRect(burnerX + 2, collarY + 3, holeW, 7);

      // Animated incoming airflow streamlines when air intake > 10%
      if (airRatio > 0.1) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
        ctx.lineWidth = 1;
        const arrowOffset = (Date.now() * 0.04) % 6;
        ctx.beginPath();
        ctx.moveTo(burnerX - 18 - arrowOffset, collarY + 6.5);
        ctx.lineTo(burnerX - 11 - arrowOffset, collarY + 6.5);
        ctx.moveTo(burnerX + 18 + arrowOffset, collarY + 6.5);
        ctx.lineTo(burnerX + 11 + arrowOffset, collarY + 6.5);
        ctx.stroke();
        ctx.restore();
      }

      // 3. FLAME ZONES (Zone 1: Cône froid, Zone 2: Dard réducteur, Zone 3: Manteau oxydant)
      // Cône froid intérieur sombre (~300°C, gaz frais non brûlé)
      if (airRatio > 0.25) {
        ctx.save();
        ctx.beginPath();
        const coldConeH = 14 + airRatio * 16;
        ctx.moveTo(burnerX - 6.5, burnerY - 7);
        ctx.quadraticCurveTo(burnerX, burnerY - 7 - coldConeH, burnerX + 6.5, burnerY - 7);
        ctx.fillStyle = 'rgba(11, 16, 32, 0.88)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      // Dard réducteur bleu intense (cône primaire de réaction vive à ~1500°C)
      if (airRatio > 0.2) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        const dardHeight = 26 + airRatio * 24;
        ctx.moveTo(burnerX - 9, burnerY - 7);
        ctx.quadraticCurveTo(burnerX, burnerY - 7 - dardHeight * 1.18, burnerX + 9, burnerY - 7);
        ctx.fillStyle = `rgba(37, 99, 235, ${0.45 + airRatio * 0.45})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.restore();
      }

      // Glow halo at base
      ctx.globalCompositeOperation = 'screen';
      const glowGrad = ctx.createRadialGradient(burnerX, burnerY - 20, 5, burnerX, burnerY - 30, 110 + airRatio * 20);
      glowGrad.addColorStop(0, `rgba(${cBase.r}, ${cBase.g}, ${cBase.b}, ${0.35 + airRatio * 0.15})`);
      glowGrad.addColorStop(1, `rgba(${cBase.r}, ${cBase.g}, ${cBase.b}, 0)`);
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(burnerX, burnerY - 20, 110 + airRatio * 20, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Heat Shimmer Waves (Mirage thermique au-dessus de la flamme)
      if (currentTemp > 750) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const shimmerT = Date.now() * 0.003;
        const shimmerBaseY = burnerY - 145;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1.8;
        for (let wave = 0; wave < 3; wave++) {
          ctx.beginPath();
          const waveY = shimmerBaseY - wave * 20;
          for (let sx = burnerX - 25; sx <= burnerX + 25; sx += 5) {
            const dy = Math.sin((sx - burnerX) * 0.18 + shimmerT * 3.5 + wave) * 2.5;
            if (sx === burnerX - 25) ctx.moveTo(sx, waveY + dy);
            else ctx.lineTo(sx, waveY + dy);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. RENDER FLAME PARTICLES
      ctx.globalCompositeOperation = 'lighter';

      const splitX = stateRef.current.cobaltSplitView ? width * 0.50 : 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // In mix mode, randomly assign particles among selected elements
        const particleChem = activeChems.length > 1 
          ? activeChems[i % activeChems.length] 
          : (activeChems[0] || 'Aucun');

        let pPalette = colorPalette;
        if (particleChem !== 'Aucun' && CHEMICAL_DATA[particleChem]?.baseColor) {
          const c = CHEMICAL_DATA[particleChem];
          // Physical thermal excitation factor for metal additives:
          const excitationFactor = Math.max(0.18, Math.min(1.0, (currentTemp - 500) / 750));
          if (excitationFactor < 0.9) {
            const blend = (cCol: ColorRGB, tCol: ColorRGB) => ({
              r: Math.round(tCol.r * (1 - excitationFactor) + cCol.r * excitationFactor),
              g: Math.round(tCol.g * (1 - excitationFactor) + cCol.g * excitationFactor),
              b: Math.round(tCol.b * (1 - excitationFactor) + cCol.b * excitationFactor),
            });
            pPalette = {
              base: blend(c.baseColor!, colorPalette.base),
              tip: blend(c.tipColor!, colorPalette.tip),
              core: blend(c.coreColor!, colorPalette.core),
              dot: c.dotColor
            };
          } else {
            pPalette = {
              base: c.baseColor!,
              tip: c.tipColor!,
              core: c.coreColor!,
              dot: c.dotColor
            };
          }
        }

        p.update(burnerX, burnerY - 6, currentTemp, airRatio, particleChem, heightScale);

        const progress = p.life / p.maxLife;

        let r: number, g: number, b: number, alpha: number;
        if (progress < 0.25) {
          const t = progress / 0.25;
          r = Math.round(pPalette.core.r + (pPalette.base.r - pPalette.core.r) * t);
          g = Math.round(pPalette.core.g + (pPalette.base.g - pPalette.core.g) * t);
          b = Math.round(pPalette.core.b + (pPalette.base.b - pPalette.core.b) * t);
          alpha = 0.85;
        } else {
          const t = (progress - 0.25) / 0.75;
          r = Math.round(pPalette.base.r + (pPalette.tip.r - pPalette.base.r) * t);
          g = Math.round(pPalette.base.g + (pPalette.tip.g - pPalette.base.g) * t);
          b = Math.round(pPalette.base.b + (pPalette.tip.b - pPalette.base.b) * t);
          alpha = (1 - t) * (0.7 + airRatio * 0.2);
        }

        // Cobalt Glass Optical Filter (absorbs yellow 560-615 nm, esp. Sodium 589 nm)
        // Authentically transmits blue/violet (400-480 nm) and deep red (680-770 nm)
        if (stateRef.current.useCobaltGlass) {
          const isFilterZone = !stateRef.current.cobaltSplitView || p.x >= splitX;
          if (isFilterZone) {
            const isYellowOrange = (r > 160 && g > 100 && b < 125);
            if (isYellowOrange) {
              // The blinding yellow Na flare is absorbed; flame appears as soft lavender-violet residual glow
              r = Math.round(r * 0.26 + 35);
              g = Math.round(g * 0.12 + 15);
              b = Math.min(255, Math.round(b * 1.5 + 130)); // Vivid royal violet / lavender
              alpha = Math.max(0.42, alpha * 0.72); // Always clearly visible!
            } else {
              // Blue, violet, and deep red flames (like Potassium lilac, pure Bunsen combustion)
              // shine with enhanced contrast and royal blue brilliance:
              b = Math.min(255, Math.round(b * 1.35 + 40));
              r = Math.min(255, Math.round(r * 1.08 + 15));
              alpha = Math.min(1.0, alpha * 1.05);
            }
          }
        }

        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, p.size));
        pGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        pGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
        pGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. PLATINUM INOCULATING LOOP (Anse de platine / Porte-échantillon dans la flamme)
      if (stateRef.current.hasSampleLoop) {
        ctx.save();
        const loopX = burnerX - 16;
        const loopY = burnerY - 36;
        const handleX = burnerX - 105;
        const handleY = burnerY - 58;

        // Kolle Handle (Manche isolant de laboratoire)
        const handleGrad = ctx.createLinearGradient(handleX, handleY - 4, handleX + 44, handleY + 6);
        handleGrad.addColorStop(0, '#1c222e');
        handleGrad.addColorStop(0.5, '#475569');
        handleGrad.addColorStop(1, '#334155');
        ctx.fillStyle = handleGrad;
        ctx.beginPath();
        ctx.roundRect(handleX, handleY - 3.5, 44, 7, 2);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Mandrin de serrage moleté en laiton
        ctx.fillStyle = '#b45309';
        ctx.fillRect(handleX + 44, handleY - 2.5, 6, 5);

        // Fil de Platine (ou Nichrome) avec gradient thermique d'incandescence
        const wireGrad = ctx.createLinearGradient(handleX + 50, handleY, loopX, loopY);
        wireGrad.addColorStop(0, '#94a3b8');
        wireGrad.addColorStop(0.4, '#cbd5e1');
        wireGrad.addColorStop(0.68, '#dc2626'); // Rouge cerise entrant dans la flamme
        wireGrad.addColorStop(0.86, '#f59e0b'); // Orange lumineux
        wireGrad.addColorStop(1, '#fef08a'); // Jaune-blanc incandescent

        ctx.strokeStyle = wireGrad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(handleX + 50, handleY);
        ctx.quadraticCurveTo(burnerX - 52, burnerY - 48, loopX - 3.5, loopY);
        ctx.stroke();

        // Boucle fermée de l'anse (loop de 3.5px)
        ctx.beginPath();
        ctx.arc(loopX, loopY, 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Sel chimique incandescent dans l'anse
        if (activeChems.length > 0) {
          const saltCol = colorPalette.base;
          // Goutte de sel fondue
          ctx.beginPath();
          ctx.arc(loopX, loopY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${saltCol.r}, ${saltCol.g}, ${saltCol.b})`;
          ctx.fill();

          // Cœur d'évaporation chaud
          ctx.beginPath();
          ctx.arc(loopX, loopY, 1.0, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Halo d'ionisation localisé
          ctx.globalCompositeOperation = 'screen';
          const saltHalo = ctx.createRadialGradient(loopX, loopY, 1, loopX, loopY, 15);
          saltHalo.addColorStop(0, `rgba(${saltCol.r}, ${saltCol.g}, ${saltCol.b}, 0.85)`);
          saltHalo.addColorStop(0.5, `rgba(${saltCol.r}, ${saltCol.g}, ${saltCol.b}, 0.28)`);
          saltHalo.addColorStop(1, 'transparent');
          ctx.fillStyle = saltHalo;
          ctx.beginPath();
          ctx.arc(loopX, loopY, 15, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 6. RENDER COBALT GLASS OVERLAY (Vue Scindée 50/50 ou Filtre Intégral)
      if (stateRef.current.useCobaltGlass) {
        ctx.save();
        if (stateRef.current.cobaltSplitView) {
          const sX = width * 0.50;
          // Translucent optical cobalt glass tint on right half
          ctx.fillStyle = 'rgba(25, 20, 75, 0.20)';
          ctx.fillRect(sX, 0, width - sX, height);

          // Divider line with glowing glass bevel
          ctx.strokeStyle = 'rgba(129, 140, 248, 0.85)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sX, 0);
          ctx.lineTo(sX, height);
          ctx.stroke();

          // Beveled glass frame on right
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.50)';
          ctx.lineWidth = 3;
          ctx.strokeRect(sX, 2, width - sX - 2, height - 4);

          // Educational Badges
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fillText('👁️ ŒIL NU (BRUT)', 14, height - 12);
          ctx.textAlign = 'right';
          ctx.fillStyle = 'rgba(165, 180, 252, 0.95)';
          ctx.fillText('🔬 FILTRE VERRE DE COBALT (ABSORPTION Na 589 nm)', width - 14, height - 12);
        } else {
          // Fullscreen cobalt filter: luminous optical glass tint with glowing bevel
          ctx.fillStyle = 'rgba(25, 20, 75, 0.18)';
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = 'rgba(129, 140, 248, 0.60)';
          ctx.lineWidth = 3.5;
          ctx.strokeRect(2, 2, width - 4, height - 4);

          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'right';
          ctx.fillStyle = 'rgba(165, 180, 252, 0.95)';
          ctx.fillText('🔬 FILTRE VERRE DE COBALT INTÉGRAL (ABSORPTION Na 589 nm)', width - 14, height - 12);
        }
        ctx.restore();
      }

      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute thermal and spectral properties
  const airRatio = airIntake / 100;
  const tempKelvin = temperature + 273.15;
  const wienLambdaPeak = Math.round(2897772 / tempKelvin);

  let statusText = isIgnited ? 'Combustion active' : 'Brûleur éteint';
  let infoTitle = '---';
  let infoDescription = '---';
  let statusDotColor = isIgnited ? '#0ebc5f' : '#64748b';
  let currentWavelengthText = '';
  let activeWavelengthNm = 589;

  const currentActiveElements = isMixMode ? mixedElements.filter(e => e !== 'Aucun') : (chemicalElement !== 'Aucun' ? [chemicalElement] : []);

  if (!isIgnited) {
    if (airIntake === 0) {
      statusText = 'Flamme étouffée (0% O₂)';
      infoTitle = 'Extinction par asphyxie : Enceinte close étanche (0% O₂)';
      infoDescription = 'Loi du triangle du feu (Combustible + Comburant + Énergie) : en milieu hermétique clos sans renouvellement d\'air, la combustion consomme l\'oxygène résiduel et s\'éteint instantanément par asphyxie. Ouvrez la virole d\'air (> 0%) et actionnez le Piezo pour rallumer.';
      statusDotColor = '#ef4444';
      activeWavelengthNm = 589;
      currentWavelengthText = 'Flamme étouffée (0% O₂)';
    } else {
      statusText = 'Sécurité gaz fermée';
      infoTitle = 'Brûleur hors tension (Vanne de gaz fermée)';
      infoDescription = 'Le débit de gaz est coupé par mesure de sécurité. Actionnez l\'allumeur piézoélectrique pour enflammer le mélange combustible.';
      statusDotColor = '#64748b';
      activeWavelengthNm = 589;
      currentWavelengthText = 'Brûleur éteint';
    }
  } else if (airIntake === 0 && burnerEnvironment === 'room') {
    statusText = useCobaltGlass ? 'Flamme de sécurité [Verre Cobalt]' : 'Flamme de sécurité (Diffusion)';
    infoTitle = 'Flamme de sécurité jaune (Virole fermée à 0% à l\'air libre)';
    infoDescription = 'Sur paillasse de laboratoire à l\'air libre, fermer la virole n\'éteint pas la flamme ! Le gaz brûle au sommet du tube avec l\'air ambiant par diffusion. Cela produit une flamme jaune douce (~500°C), éclairante et fuligineuse (suie incandescente de carbone), visible de loin pour la sécurité des manipulateurs.';
    statusDotColor = '#f59e0b';
    activeWavelengthNm = 589;
    currentWavelengthText = 'Flamme de sécurité jaune (Suie de carbone incandescente)';
  } else if (currentActiveElements.length > 0) {
    const isCold = temperature < 850;
    const atomizationNote = isCold 
      ? ` ⚠️ Note d'atomisation : à ${temperature}°C, l'énergie thermique est faible pour dissocier et exciter les atomes. Ouvrez la virole (> 60%) pour dépasser 1300°C et libérer tout le spectre quantique.`
      : '';

    if (currentActiveElements.length === 1) {
      const chem = CHEMICAL_DATA[currentActiveElements[0]];
      statusText = useCobaltGlass ? `Émission : ${currentActiveElements[0]} [Verre Cobalt]` : `Émission : ${currentActiveElements[0]}`;
      infoTitle = `${chem.title} ${isCold ? '(Excitation partielle)' : '(Excitation optimale)'}`;
      infoDescription = `${chem.spectrumNote} Température : ${temperature}°C — Virole O₂ : ${airIntake}%.${atomizationNote}`;
      statusDotColor = chem.dotColor;
      currentWavelengthText = chem.wavelengthLabel;
      activeWavelengthNm = chem.primaryWavelength;
    } else {
      // Mixed elements mode
      statusText = useCobaltGlass 
        ? `Mélange Pyrotechnique : ${currentActiveElements.join(' + ')} [Verre Cobalt]`
        : `Mélange Pyrotechnique : ${currentActiveElements.join(' + ')}`;
      infoTitle = `Superposition Spectrale Multicomposante (${currentActiveElements.length} éléments)`;
      infoDescription = `Interférence constructive et transitions électroniques superposées : ${currentActiveElements.map(e => CHEMICAL_DATA[e].label).join(', ')}.${atomizationNote}`;
      statusDotColor = CHEMICAL_DATA[currentActiveElements[0]].dotColor;
      currentWavelengthText = currentActiveElements.map(e => CHEMICAL_DATA[e].lines[0]?.label || e).join(' | ');
      activeWavelengthNm = CHEMICAL_DATA[currentActiveElements[0]].primaryWavelength;
    }
  } else {
    let tempDesc = '';
    let colorName = '';
    let dotCol = '#0ebc5f';
    let visibleWave = 589;

    const adjustedTemp = temperature + airRatio * 250;

    if (adjustedTemp < 800) {
      colorName = 'Rouge sombre';
      tempDesc = 'Combustion incomplète / réductrice. Émission continue de suies incandescentes (Loi de Planck / Wien).';
      dotCol = theme === 'light' ? '#dc2626' : '#ef4444';
      visibleWave = 720;
    } else if (adjustedTemp < 1000) {
      colorName = 'Orange incandescent';
      tempDesc = 'Combustion modérée. Présence de nanoparticules de carbone solide incandescentes.';
      dotCol = theme === 'light' ? '#ea580c' : '#f97316';
      visibleWave = 640;
    } else if (adjustedTemp < 1350) {
      colorName = 'Jaune doré';
      tempDesc = 'Combustion équilibrée standard. Rayonnement thermique continu de nanoparticules de carbone (Loi de Wien).';
      dotCol = theme === 'light' ? '#b45309' : '#f59e0b';
      visibleWave = 590;
    } else if (adjustedTemp < 1550) {
      colorName = 'Jaune incandescent vif';
      tempDesc = 'Haute température d\'excitation thermique. Transition progressive vers le dard réducteur et la chimiluminescence.';
      dotCol = theme === 'light' ? '#a16207' : '#eab308';
      visibleWave = 575;
    } else {
      colorName = 'Bleu intense (CH* & C₂)';
      tempDesc = 'Combustion oxydante complète à fort débit d\'oxygène : la couleur bleue n\'est PAS un corps noir, mais la chimiluminescence des radicaux moléculaires excités CH* (431 nm) et C₂ (Bandes de Swan à 516 nm) !';
      dotCol = theme === 'light' ? '#1d4ed8' : '#38bdf8';
      visibleWave = 445;
    }

    statusText = useCobaltGlass ? `Thermique : ${colorName} [Verre Cobalt]` : `Thermique : ${colorName}`;
    infoTitle = `Flamme thermique (${temperature}°C, ${airIntake}% O₂) — ${colorName}`;
    infoDescription = tempDesc;
    statusDotColor = dotCol;
    activeWavelengthNm = visibleWave;
    currentWavelengthText = `λ visible dominante ≈ ${visibleWave} nm (Pic Planck/Wien : ${wienLambdaPeak} nm IR)`;
  }

  // Accessible color guaranteed to pass WCAG contrast on light surfaces
  const uiColor = getAccessibleColor(statusDotColor, theme === 'light');

  // All active spectral lines to display on the spectroscope
  const visibleSpectralLines: SpectralLine[] = [];
  if (currentActiveElements.length > 0) {
    currentActiveElements.forEach(elemKey => {
      if (CHEMICAL_DATA[elemKey]) {
        visibleSpectralLines.push(...CHEMICAL_DATA[elemKey].lines);
      }
    });
  } else if (isIgnited && airIntake >= 30 && temperature >= 1100) {
    // Real Bunsen hydrocarbon combustion radical lines
    visibleSpectralLines.push(...BUNSEN_RADICAL_LINES);
  }

  const sliderPercent = ((temperature - 500) / 1500) * 100;
  const spectroPercent = Math.max(0, Math.min(100, ((activeWavelengthNm - 380) / (750 - 380)) * 100));

  // EXPORT LAB SNAPSHOT AS DOWNLOADABLE PNG REPORT
  const handleExportLabReport = () => {
    setIsDownloadingReport(true);
    try {
      const flameCanvas = canvasRef.current;
      if (!flameCanvas) return;

      const reportCanvas = document.createElement('canvas');
      reportCanvas.width = 1000;
      reportCanvas.height = 700;
      const rCtx = reportCanvas.getContext('2d');
      if (!rCtx) return;

      // Dark Scientific Laboratory Background
      rCtx.fillStyle = '#080c14';
      rCtx.fillRect(0, 0, 1000, 700);

      // Header Banner Bar
      rCtx.fillStyle = '#0e1726';
      rCtx.fillRect(0, 0, 1000, 75);

      const headerTitleGrad = rCtx.createLinearGradient(30, 0, 520, 0);
      headerTitleGrad.addColorStop(0, '#00f0ff');
      headerTitleGrad.addColorStop(0.3, '#38bdf8');
      headerTitleGrad.addColorStop(0.65, '#a855f7');
      headerTitleGrad.addColorStop(1, '#ec4899');
      rCtx.fillStyle = headerTitleGrad;
      rCtx.font = 'bold 22px sans-serif';
      rCtx.fillText('FICHE DE SPECTROSCOPIE & FLAMME', 30, 45);

      rCtx.fillStyle = '#ec4899';
      rCtx.font = 'bold 15px monospace';
      rCtx.textAlign = 'right';
      rCtx.fillText('FRAPPES CÉRÉBRALES', 970, 45);
      rCtx.textAlign = 'left';

      // Draw Flame Canvas
      rCtx.drawImage(flameCanvas, 30, 95, 460, 280);

      // Border around flame
      rCtx.strokeStyle = statusDotColor;
      rCtx.lineWidth = 3;
      rCtx.strokeRect(30, 95, 460, 280);

      // Parameters Box on the Right
      rCtx.fillStyle = '#111827';
      rCtx.fillRect(510, 95, 460, 280);
      rCtx.strokeStyle = '#1f2937';
      rCtx.lineWidth = 1;
      rCtx.strokeRect(510, 95, 460, 280);

      const boxParamGrad = rCtx.createLinearGradient(530, 0, 920, 0);
      boxParamGrad.addColorStop(0, '#22d3ee');
      boxParamGrad.addColorStop(0.5, '#a855f7');
      boxParamGrad.addColorStop(1, '#ec4899');
      rCtx.fillStyle = boxParamGrad;
      rCtx.font = 'bold 16px sans-serif';
      rCtx.fillText('DONNÉES DU BRÛLEUR & THERMIQUE', 530, 130);

      rCtx.font = '14px sans-serif';
      rCtx.fillStyle = '#94a3b8';
      rCtx.fillText(`Température mesurée :`, 530, 165);
      rCtx.fillStyle = statusDotColor;
      rCtx.font = 'bold 16px monospace';
      rCtx.fillText(`${temperature} °C (${tempKelvin.toFixed(1)} K)`, 710, 165);

      rCtx.font = '14px sans-serif';
      rCtx.fillStyle = '#94a3b8';
      rCtx.fillText(`Aération / Virole d'air :`, 530, 200);
      rCtx.fillStyle = '#38bdf8';
      rCtx.font = 'bold 15px monospace';
      rCtx.fillText(`${airIntake}% (O₂ ${airIntake > 60 ? 'Oxydant' : 'Réducteur'})`, 710, 200);

      rCtx.font = '14px sans-serif';
      rCtx.fillStyle = '#94a3b8';
      rCtx.fillText(`Composition :`, 530, 235);
      rCtx.fillStyle = '#ffffff';
      rCtx.font = 'bold 14px sans-serif';
      rCtx.fillText(`${currentActiveElements.join(', ') || 'Gaz Bunsen pur'}`, 710, 235);

      rCtx.font = '14px sans-serif';
      rCtx.fillStyle = '#94a3b8';
      rCtx.fillText(`Pic de Wien théorique :`, 530, 270);
      rCtx.fillStyle = '#fbbf24';
      rCtx.font = 'bold 14px monospace';
      rCtx.fillText(`${wienLambdaPeak} nm (Infrarouge)`, 710, 270);

      rCtx.font = '14px sans-serif';
      rCtx.fillStyle = '#94a3b8';
      rCtx.fillText(`État du système :`, 530, 305);
      rCtx.fillStyle = isIgnited ? '#0ebc5f' : '#ef4444';
      rCtx.font = 'bold 14px sans-serif';
      rCtx.fillText(isIgnited ? 'Combustion continue' : 'Éteint', 710, 305);

      // Spectroscope Optical Bar
      const spectroTitleGrad = rCtx.createLinearGradient(30, 0, 500, 0);
      spectroTitleGrad.addColorStop(0, '#22d3ee');
      spectroTitleGrad.addColorStop(0.5, '#a855f7');
      spectroTitleGrad.addColorStop(1, '#ec4899');
      rCtx.fillStyle = spectroTitleGrad;
      rCtx.font = 'bold 16px sans-serif';
      rCtx.fillText('SPECTRE OPTIQUE VISIBLE (380 nm - 750 nm)', 30, 420);

      const sX = 30, sY = 440, sW = 940, sH = 50;

      // Draw rainbow gradient
      const rainbow = rCtx.createLinearGradient(sX, 0, sX + sW, 0);
      rainbow.addColorStop(0, '#4c1d95');
      rainbow.addColorStop(0.18, '#3b82f6');
      rainbow.addColorStop(0.32, '#06b6d4');
      rainbow.addColorStop(0.48, '#10b981');
      rainbow.addColorStop(0.64, '#eab308');
      rainbow.addColorStop(0.78, '#f97316');
      rainbow.addColorStop(0.95, '#dc2626');
      rainbow.addColorStop(1, '#991b1b');

      rCtx.fillStyle = spectrumMode === 'emission' && visibleSpectralLines.length > 0 ? '#0b0f19' : rainbow;
      rCtx.fillRect(sX, sY, sW, sH);

      // Draw emission or absorption lines
      visibleSpectralLines.forEach(line => {
        const linePos = sX + ((line.lambda - 380) / (750 - 380)) * sW;
        rCtx.strokeStyle = spectrumMode === 'emission' ? '#ffffff' : '#000000';
        rCtx.lineWidth = 2.5;
        rCtx.beginPath();
        rCtx.moveTo(linePos, sY);
        rCtx.lineTo(linePos, sY + sH);
        rCtx.stroke();
      });

      rCtx.strokeStyle = '#475569';
      rCtx.lineWidth = 2;
      rCtx.strokeRect(sX, sY, sW, sH);

      // Footer notes
      rCtx.fillStyle = '#64748b';
      rCtx.font = '12px monospace';
      rCtx.fillText(`Généré le ${new Date().toLocaleDateString('fr-FR')} - Chaîne & Réseaux : Frappes Cérébrales`, 30, 660);

      // Download triggered
      const link = document.createElement('a');
      link.download = `rapport-spectroscopie-frappes-cerebrales-${temperature}C.png`;
      link.href = reportCanvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingReport(false);
    }
  };

  return (
    <main className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-[#090b10] overflow-y-auto p-3 sm:p-5' : 'max-w-4xl mx-auto p-4 sm:p-6'} flex flex-col gap-3 sm:gap-5 transition-colors duration-200`}>
      
      {/* Top Cybernetic Sci-Fi Banner: Frappes Cérébrales */}
      {!isFullscreen && <BannerHeader flameColor={statusDotColor} />}

      {/* Header : Compact HUD in Fullscreen, Full 3D Hero in Standard View */}
      {isFullscreen ? (
        <header className="flex items-center justify-between flex-wrap gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--stroke-default)] shadow-lg">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
            <h1 className="text-sm sm:text-base font-bold flex items-center gap-2">
              <span className="title-3d text-sm sm:text-base">Simulateur de Flamme & Spectroscopie</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Mode Démo / Plein Écran
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportLabReport}
              disabled={isDownloadingReport}
              className="btn-banner-gradient"
              title="Exporter une fiche de laboratoire PNG complète"
            >
              <Camera className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
              <span className="hidden sm:inline">{isDownloadingReport ? '...' : 'Fiche Labo (PNG)'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
              className="btn-toggle-3d"
              title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" /> : <Moon className="w-4 h-4 text-sky-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />}
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="btn-banner-gradient"
              title="Quitter le mode plein écran (Échap)"
            >
              <Minimize2 className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
              <span>Quitter Plein Écran (Échap)</span>
            </button>
          </div>
        </header>
      ) : (
        <header className="flex flex-col gap-2 pb-2.5 border-b border-[var(--stroke-default)]">
          <div className="flex flex-col items-center text-center gap-1.5">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <Flame className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] animate-pulse shrink-0" />
              {/* 3D TITLE */}
              <h1 className="title-3d text-2xl sm:text-3xl font-extrabold tracking-tight text-center">
                Simulateur de Flamme & Spectroscopie
              </h1>
              <Flame className="w-7 h-7 text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.7)] animate-pulse shrink-0 -scale-x-100" />
            </div>
            <p className="text-sm text-[var(--on-surface-variant)] max-w-2xl text-center">
              Explorez la thermique de combustion, la virole d'air du bec Bunsen et les raies spectrales quantiques.
            </p>
          </div>

          {/* Action Toolbar on the Right: Fullscreen, Screenshot, Dark Mode */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            {/* Quick Lab Actions */}
            <div className="flex items-center gap-2">
              {/* Export Snapshot Button */}
              <button
                type="button"
                onClick={handleExportLabReport}
                disabled={isDownloadingReport}
                className="btn-banner-gradient"
                title="Exporter une fiche de laboratoire PNG complète"
              >
                <Camera className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                <span>{isDownloadingReport ? 'Génération...' : 'Fiche Labo (PNG)'}</span>
              </button>

              {/* Fullscreen Video Demo Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="btn-banner-gradient"
                title="Mode Démonstration / Plein Écran pour vos vidéos"
              >
                <Maximize2 className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                <span>Mode Plein Écran</span>
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
              className="btn-toggle-3d"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  <span>Mode clair</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  <span>Mode sombre</span>
                </>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Interactive Canvas Viewport */}
      <section 
        aria-label="Simulation de flamme"
        className={`relative w-full ${isFullscreen ? 'h-[calc(100vh-140px)] min-h-[380px] max-h-[82vh]' : 'h-[295px] sm:h-[330px]'} overflow-hidden rounded-xl bg-[#090b10] border-2 shadow-inner transition-all duration-300`}
        style={{ borderColor: uiColor, boxShadow: `0 0 20px ${uiColor}25` }}
      >
        <div className="relative w-full h-full min-h-0 overflow-hidden">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            className="block w-full h-full outline-none"
          />
        </div>
        
        {/* Floating Top Controls & Status Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none flex-wrap">
          {/* Burner Igniter / Safety Switch & Cobalt Glass Filter */}
          <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={isIgnited ? () => setIsIgnited(false) : triggerPiezoIgnition}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md border transition-all shadow-lg cursor-pointer ${
                isIgnited 
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900' 
                  : 'bg-rose-950/90 border-rose-500/70 text-rose-300 hover:bg-rose-900 animate-pulse'
              }`}
              title="Allumeur piezoélectrique / Sécurité vanne gaz"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isIgnited ? 'Gaz Ouvert (ON)' : 'Allumer (Piezo)'}</span>
            </button>

            {/* Anse de Platine (Porte-échantillon dans la flamme) */}
            <button
              type="button"
              onClick={() => setHasSampleLoop(!hasSampleLoop)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md border transition-all shadow-lg cursor-pointer ${
                hasSampleLoop
                  ? 'bg-amber-950/85 border-amber-500/70 text-amber-300 hover:bg-amber-900 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-[#0f0f0f]/80 border-white/20 text-slate-400 hover:text-white'
              }`}
              title="Anse de platine : porte-échantillon de laboratoire introduisant le sel métallique au cœur de la flamme"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Anse : {hasSampleLoop ? 'Dans la flamme' : 'Retirée'}</span>
            </button>

            {/* Verre de Cobalt Toggle */}
            <button
              type="button"
              onClick={() => setUseCobaltGlass(!useCobaltGlass)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md border transition-all shadow-lg cursor-pointer ${
                useCobaltGlass
                  ? 'bg-indigo-900/90 border-indigo-400 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.6)] ring-1 ring-indigo-400'
                  : 'bg-[#0f0f0f]/80 border-white/20 text-slate-300 hover:text-white hover:bg-[#0f0f0f]'
              }`}
              title="Filtre au verre de cobalt : absorbe la raie jaune du Sodium (589 nm) pour révéler le Potassium (violet) ou le Rubidium"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verre de Cobalt : {useCobaltGlass ? 'ACTIF' : 'OFF'}</span>
            </button>

            {/* Mode Vue Scindée 50/50 vs Filtre Intégral pour le Verre de Cobalt */}
            {useCobaltGlass && (
              <button
                type="button"
                onClick={() => setCobaltSplitView(!cobaltSplitView)}
                className="px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 backdrop-blur-md border bg-indigo-950/90 border-indigo-400/80 text-indigo-200 hover:bg-indigo-900 shadow-md cursor-pointer animate-in fade-in"
                title={cobaltSplitView ? 'Passer en filtre intégral sur toute la surface' : 'Passer en comparaison scindée 50/50'}
              >
                <Split className="w-3 h-3 text-indigo-400" />
                <span>{cobaltSplitView ? 'Vue Scindée 50/50' : 'Filtre Intégral'}</span>
              </button>
            )}
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {/* Wavelength Pill Badge */}
            <div className="bg-[#0f0f0f]/85 backdrop-blur-md border border-white/15 rounded-full px-3 py-1 text-xs font-mono flex items-center gap-1.5 shadow-lg">
              <span className="text-cyan-400 font-bold">λ:</span>
              <span style={{ color: statusDotColor }} className="font-semibold transition-colors duration-200">
                {activeWavelengthNm} nm
              </span>
            </div>

            {/* Flame Status Badge */}
            <div className="bg-[#0f0f0f]/85 backdrop-blur-md border border-white/15 rounded-full px-3 py-1 text-white text-xs font-mono flex items-center gap-2 shadow-lg">
              <span
                className="w-2.5 h-2.5 rounded-full transition-colors duration-300 shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: statusDotColor, color: statusDotColor }}
              />
              <span>{statusText}</span>
            </div>

            {/* Quick Canvas Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 backdrop-blur-md border bg-[#0f0f0f]/85 border-white/20 text-slate-300 hover:text-white hover:border-amber-400 shadow-lg cursor-pointer transition-colors"
              title={isFullscreen ? 'Quitter le mode plein écran (Échap)' : 'Passer la simulation en mode plein écran'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Réduire</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Plein Écran</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Jauges du Brûleur : Température & Débit d'Air O₂ (Directement sous la flamme) */}
      <section 
        className="p-4 sm:p-5 bg-[var(--surface-dim)] rounded-xl border-2 shadow-sm flex flex-col gap-4 transition-all duration-300"
        style={{ borderColor: uiColor, boxShadow: `0 0 16px ${uiColor}20` }}
      >
        {/* Header with Couplage Physique Toggle and Milieu Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-[var(--stroke-default)]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            <h3 className="text-sm sm:text-base font-bold">
              <span className="card-title-gradient">Jauges du Brûleur : Température & Aération O₂</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Milieu : Paillasse libre vs Enceinte étanche */}
            <button
              type="button"
              onClick={() => {
                const nextEnv = burnerEnvironment === 'room' ? 'chamber' : 'room';
                setBurnerEnvironment(nextEnv);
                if (nextEnv === 'chamber' && airIntake === 0) {
                  setIsIgnited(false);
                } else if (nextEnv === 'room' && airIntake === 0) {
                  setIsIgnited(true);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer border ${
                burnerEnvironment === 'room'
                  ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                  : 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
              }`}
              title="Bascule entre le comportement réel sur paillasse (virole à 0% = flamme de sécurité jaune) et en enceinte hermétique fermée (virole à 0% = extinction du triangle du feu)"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Milieu : {burnerEnvironment === 'room' ? 'Paillasse libre (Air ambiant)' : 'Enceinte close étanche'}</span>
            </button>

            {/* Couplage thermique */}
            <button
              type="button"
              onClick={() => setIsThermalCoupled(!isThermalCoupled)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer border ${
                isThermalCoupled 
                  ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)]' 
                  : 'bg-[var(--surface)] border-[var(--stroke-default)] text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
              }`}
              title="Active ou désactive la corrélation physique directe entre le débit de comburant O₂ et la température de flamme"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Liaison Virole ↔ Température : {isThermalCoupled ? 'ACTIVE' : 'DÉCOUPLÉE'}</span>
            </button>
          </div>
        </div>

        {/* Temperature Slider Control WITH SYNCHRONOUS FLAME COLOR */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="tempSlider" className="text-sm sm:text-base font-medium flex items-center gap-1.5 cursor-pointer">
              <Flame className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
              <span className="card-title-gradient font-bold">Température de combustion</span>
            </label>
            {/* Value Badge matching exact flame color with full accessibility */}
            <div
              className={`font-mono text-sm sm:text-base font-bold px-3 py-1 rounded-lg border transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
                theme === 'light'
                  ? 'bg-amber-500/10 border-amber-600/40 text-amber-900 shadow-sm'
                  : ''
              }`}
              style={theme === 'dark' ? {
                color: statusDotColor,
                borderColor: `${statusDotColor}60`,
                backgroundColor: `${statusDotColor}15`,
                boxShadow: `0 0 10px ${statusDotColor}25`
              } : {
                color: uiColor,
                borderColor: `${uiColor}50`,
                backgroundColor: `${uiColor}15`,
                boxShadow: `0 0 8px ${uiColor}20`
              }}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isIgnited ? 'animate-pulse' : ''} shadow-sm shrink-0`} style={{ backgroundColor: statusDotColor }} />
              <span className="font-extrabold tracking-tight">
                {!isIgnited ? (airIntake === 0 ? '0 °C (Asphyxie)' : 'Éteint (Gaz fermé)') : `${temperature} °C`}
              </span>
            </div>
          </div>

          <div className="w-full flex items-center py-1">
            <input
              type="range"
              id="tempSlider"
              min="500"
              max="2000"
              step="10"
              value={temperature}
              onChange={(e) => handleTempChange(parseFloat(e.target.value))}
              className="lumi-slider-track"
              style={{
                background: `linear-gradient(to right, ${uiColor} 0%, ${uiColor} ${sliderPercent}%, var(--surface-container-high) ${sliderPercent}%, var(--surface-container-high) 100%)`,
                boxShadow: `0 0 10px ${uiColor}35`,
                '--flame-color': uiColor,
                '--flame-color-glow': `${uiColor}45`
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* BEC BUNSEN AIR COLLAR / O2 INLET CONTROL */}
        <div className="flex flex-col gap-2 p-3 bg-[var(--surface)] rounded-lg border border-[var(--stroke-default)] shadow-sm">
          <div className="flex items-center justify-between">
            <label htmlFor="airSlider" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer">
              <Wind className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
              <span className="card-title-gradient font-bold">Virole d'air du bec Bunsen (Débit d'oxygène O₂)</span>
            </label>
            <span className={`font-mono text-xs sm:text-sm font-bold ${airIntake === 0 ? (burnerEnvironment === 'chamber' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400') : 'text-sky-600 dark:text-sky-400'}`}>
              {airIntake}% {airIntake === 0 ? (burnerEnvironment === 'chamber' ? '(0% O₂ — Flamme asphyxiée)' : '(0% O₂ primaire — Flamme de sécurité jaune)') : airIntake < 20 ? '(Air réducteur / Jaune)' : airIntake > 80 ? '(Air oxydant / Dard bleu)' : '(Normal)'}
            </span>
          </div>

          <div className="w-full flex items-center">
            <input
              type="range"
              id="airSlider"
              min="0"
              max="100"
              step="5"
              value={airIntake}
              onChange={(e) => handleAirChange(parseFloat(e.target.value))}
              className="lumi-slider-track"
              style={{
                background: `linear-gradient(to right, ${airIntake === 0 ? (burnerEnvironment === 'chamber' ? '#ef4444' : '#f59e0b') : '#0284c7'} 0%, ${airIntake === 0 ? (burnerEnvironment === 'chamber' ? '#ef4444' : '#f59e0b') : '#38bdf8'} ${airIntake}%, var(--surface-container-high) ${airIntake}%, var(--surface-container-high) 100%)`,
                '--flame-color': airIntake === 0 ? (burnerEnvironment === 'chamber' ? '#ef4444' : '#f59e0b') : '#0284c7',
                '--flame-color-glow': airIntake === 0 ? (burnerEnvironment === 'chamber' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)') : 'rgba(2,132,199,0.3)'
              } as React.CSSProperties}
            />
          </div>

          {/* Alert or explanation when air intake is zero */}
          {airIntake === 0 ? (
            burnerEnvironment === 'chamber' ? (
              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-rose-300 animate-in fade-in">
                <span className="flex items-center gap-1.5">
                  <Power className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                  <span><strong>Flamme éteinte par asphyxie (0% O₂) :</strong> Enceinte étanche sans comburant.</span>
                </span>
                <button
                  type="button"
                  onClick={triggerPiezoIgnition}
                  className="self-start sm:self-auto px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer transition shadow"
                >
                  Rallumer le brûleur
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-500/50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-amber-900 dark:text-amber-300 animate-in fade-in">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span><strong>Flamme de sécurité active (~500°C) :</strong> À l'air libre, le gaz brûle avec l'air ambiant par diffusion. Ouvrez la virole pour chauffer.</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleAirChange(50)}
                  className="self-start sm:self-auto px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer transition shadow"
                >
                  Ouvrir la virole (50%)
                </button>
              </div>
            )
          ) : (
            <div className="flex justify-between text-[10px] sm:text-[11px] text-[var(--on-surface-variant)]">
              <span>0% (Coupé)</span>
              <span>15% (Flamme éclairante jaune)</span>
              <span>50% (Équilibrée)</span>
              <span>100% (Dard rugissant bleu)</span>
            </div>
          )}
        </div>
      </section>

      {/* Summary & Physics Context Callout */}
      <section
        className="p-3.5 sm:p-4 bg-[var(--surface-dim)] rounded-xl border-2 flex flex-col gap-1 transition-all duration-300 shadow-sm"
        style={{ borderColor: uiColor, boxShadow: `0 0 16px ${uiColor}20` }}
      >
        <span className="card-title-gradient font-bold text-sm sm:text-base">
          {infoTitle}
        </span>
        <span className="text-xs sm:text-sm text-[var(--on-surface-variant)] leading-relaxed">
          {infoDescription}
        </span>
      </section>

      {/* Controls Deck */}
      <section 
        className="flex flex-col gap-5 p-4 sm:p-5 bg-[var(--surface-dim)] rounded-xl border-2 shadow-sm transition-all duration-300"
        style={{ borderColor: uiColor, boxShadow: `0 0 16px ${uiColor}20` }}
      >
        
        {/* SPECTROSCOPY / WAVELENGTH DISPLAY BAR WITH EMISSION / ABSORPTION TOGGLE */}
        <div 
          className="flex flex-col gap-2 p-3 bg-[var(--surface)] rounded-lg border-2 shadow-sm transition-all duration-300"
          style={{ borderColor: uiColor, boxShadow: `0 0 10px ${uiColor}15` }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-medium">
              <Activity className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
              <span className="card-title-gradient font-bold text-xs sm:text-sm">Spectroscopie visible (380 nm - 750 nm)</span>
              <span className="text-[11px] text-[var(--on-surface-variant)] hidden sm:inline">(Cliquez sur les raies pour les détails quantiques)</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Toggle Mode d'Affichage: Fente Diffraction vs Profil CCD vs Les deux */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--surface-dim)] border border-[var(--stroke-default)] text-xs">
                <button
                  type="button"
                  onClick={() => setSpectroView('both')}
                  className={`px-2 py-1 rounded font-medium transition cursor-pointer ${
                    spectroView === 'both' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
                  }`}
                  title="Afficher simultanément le spectre visuel et la courbe d'intensité spectrophotométrique"
                >
                  Vue Combinée
                </button>
                <button
                  type="button"
                  onClick={() => setSpectroView('diffraction')}
                  className={`px-2 py-1 rounded font-medium transition cursor-pointer ${
                    spectroView === 'diffraction' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
                  }`}
                  title="Afficher uniquement les raies de diffraction du spectroscope"
                >
                  Raies Visuelles
                </button>
                <button
                  type="button"
                  onClick={() => setSpectroView('profile')}
                  className={`px-2 py-1 rounded font-medium transition cursor-pointer ${
                    spectroView === 'profile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
                  }`}
                  title="Afficher uniquement le profil d'intensité CCD I(λ) (Spectrophotomètre)"
                >
                  Courbe CCD I(λ)
                </button>
              </div>

              {/* Toggle: Émission vs Absorption */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--surface-dim)] border border-[var(--stroke-default)] text-xs">
                <button
                  type="button"
                  onClick={() => setSpectrumMode('emission')}
                  className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                    spectrumMode === 'emission' ? 'bg-cyan-600 text-white shadow-sm' : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
                  }`}
                >
                  Émission
                </button>
                <button
                  type="button"
                  onClick={() => setSpectrumMode('absorption')}
                  className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                    spectrumMode === 'absorption' ? 'bg-pink-600 text-white shadow-sm' : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
                  }`}
                >
                  Absorption (Fraunhofer)
                </button>
              </div>
            </div>
          </div>

          {/* Visible Optical Spectrum Gradient Bar with Dynamic Cursor & Emission/Absorption Lines */}
          {spectroView !== 'profile' && (
            <div className="flex flex-col gap-1.5 mt-4">
              <div className="relative w-full h-8 rounded-md border border-slate-700/60 shadow-inner bg-slate-950">
                {/* Rainbow visible light background */}
                <div
                  className={`absolute inset-0 rounded-md overflow-hidden transition-opacity duration-300 ${
                    spectrumMode === 'emission' && visibleSpectralLines.length > 0 ? 'opacity-20' : 'opacity-85'
                  }`}
                  style={{
                    background: 'linear-gradient(to right, #4c1d95 0%, #3b82f6 18%, #06b6d4 32%, #10b981 48%, #eab308 64%, #f97316 78%, #dc2626 95%, #991b1b 100%)'
                  }}
                />

                {/* Spectral Lines (Clickable with wide 32px hit-target for effortless clicking) */}
                {visibleSpectralLines.map((line, idx) => {
                  const linePct = Math.max(0, Math.min(100, ((line.lambda - 380) / (750 - 380)) * 100));
                  const isSelected = selectedQuantumLine?.lambda === line.lambda;
                  const lineColor = wavelengthToColor(line.lambda);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedQuantumLine(isSelected ? null : line);
                      }}
                      className={`absolute top-0 bottom-0 flex items-center justify-center cursor-pointer group focus:outline-none transition-all ${
                        isSelected ? 'z-40' : 'z-30'
                      }`}
                      style={{
                        left: `${linePct}%`,
                        width: '32px',
                        marginLeft: '-16px',
                      }}
                      title={`${line.label} — ${lineColor.name} — Cliquez pour ouvrir la fiche quantique`}
                    >
                      {/* Floating Glowing Badge Over Selected Line */}
                      {isSelected && (
                        <div 
                          className="absolute -top-7 z-50 px-2 py-0.5 rounded font-mono font-black text-[10px] shadow-lg border border-white flex flex-col items-center pointer-events-none animate-bounce"
                          style={{ 
                            backgroundColor: lineColor.hex,
                            color: (lineColor.r * 0.299 + lineColor.g * 0.587 + lineColor.b * 0.114 > 140) ? '#090b10' : '#ffffff',
                            boxShadow: `0 0 16px ${lineColor.hex}`
                          }}
                        >
                          <span>{line.lambda} nm</span>
                          <span className="w-1.5 h-1.5 rotate-45 -mb-1 border-r border-b border-white" style={{ backgroundColor: lineColor.hex }} />
                        </div>
                      )}

                      {/* Top Pointer Beacon when Selected */}
                      {isSelected && (
                        <span 
                          className="absolute -top-1 w-2.5 h-2.5 bg-white border-2 rotate-45 z-40 animate-pulse" 
                          style={{ borderColor: lineColor.hex, boxShadow: `0 0 12px ${lineColor.hex}` }}
                        />
                      )}

                      {/* Broad Laser Beam Aura when Selected */}
                      {isSelected && (
                        <span 
                          className="absolute top-0 bottom-0 w-4 blur-[4px] animate-pulse pointer-events-none" 
                          style={{ backgroundColor: `${lineColor.hex}99` }}
                        />
                      )}

                      {/* The visible spectral line IN ITS EXACT PHYSICAL WAVELENGTH COLOR */}
                      <span
                        className={`h-full transition-all duration-200 ${
                          isSelected 
                            ? 'w-[4.5px]' 
                            : selectedQuantumLine 
                              ? 'w-[2px] opacity-40 group-hover:opacity-100 group-hover:w-[3.5px]'
                              : 'w-[2.5px] opacity-95 group-hover:w-[4px]'
                        }`}
                        style={{
                          backgroundColor: spectrumMode === 'emission' 
                            ? (isSelected ? '#ffffff' : lineColor.hex) 
                            : '#05070d',
                          boxShadow: spectrumMode === 'emission'
                            ? isSelected 
                              ? `0 0 8px #ffffff, 0 0 18px ${lineColor.hex}, 0 0 35px ${lineColor.hex}, 0 0 50px ${lineColor.hex}` 
                              : `0 0 6px ${lineColor.hex}, 0 0 14px ${lineColor.hex}dd`
                            : '0 0 2px rgba(0,0,0,0.9)',
                          borderLeft: spectrumMode === 'absorption' ? '1px solid rgba(255,255,255,0.2)' : undefined
                        }}
                      />

                      {/* Bottom Pointer Beacon when Selected */}
                      {isSelected && (
                        <span 
                          className="absolute -bottom-1 w-2.5 h-2.5 bg-white border-2 rotate-45 z-40 animate-pulse" 
                          style={{ borderColor: lineColor.hex, boxShadow: `0 0 12px ${lineColor.hex}` }}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Dynamic Active Wavelength Needle / Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-1 -ml-0.5 z-20 pointer-events-none transition-all duration-200 flex flex-col items-center justify-between"
                  style={{ left: `${spectroPercent}%` }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-[0_0_10px_currentColor] -mt-0.5"
                    style={{ backgroundColor: statusDotColor, color: statusDotColor }}
                  />
                  <div
                    className="w-0.5 h-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: statusDotColor, color: statusDotColor }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-[0_0_10px_currentColor] -mb-0.5"
                    style={{ backgroundColor: statusDotColor, color: statusDotColor }}
                  />
                </div>
              </div>

              {/* Scale Labels (UV, Violet, Blue, Green, Yellow, Red, IR) */}
              <div className="flex justify-between text-[10px] sm:text-[11px] font-mono text-[var(--on-surface-variant)] px-0.5">
                <span>380 nm (UV/Violet)</span>
                <span className="hidden sm:inline">480 nm (Bleu)</span>
                <span>530 nm (Vert)</span>
                <span className="hidden sm:inline">590 nm (Jaune)</span>
                <span>650 nm (Orange)</span>
                <span>750 nm (Rouge/IR)</span>
              </div>
            </div>
          )}

          {/* PROFIL D'INTENSITÉ SPECTROPHOTOMÉTRIQUE I(λ) (CAPTEUR CCD / SPECTROPHOTOMÈTRE) */}
          {spectroView !== 'diffraction' && (
            <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-800 shadow-inner flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 pb-1 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                  <span className="card-title-gradient font-bold text-xs sm:text-sm">Profil d'Intensité CCD I(λ) (Spectrophotomètre de Laboratoire)</span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {spectrumMode === 'emission' ? 'Signal d\'Émission atomique gaussien + Continu de Planck' : 'Spectre continu avec raies d\'absorption de Fraunhofer'}
                </span>
              </div>

              {/* SVG Graphic for CCD Curve */}
              <div className="relative w-full h-[155px] bg-[#07090e] rounded-md border border-slate-800/60 overflow-hidden">
                <svg 
                  viewBox="0 0 740 155" 
                  className="w-full h-full select-none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="spectrumCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.9" />
                      <stop offset="18%" stopColor="#3b82f6" stopOpacity="0.9" />
                      <stop offset="32%" stopColor="#06b6d4" stopOpacity="0.9" />
                      <stop offset="48%" stopColor="#10b981" stopOpacity="0.9" />
                      <stop offset="64%" stopColor="#eab308" stopOpacity="0.9" />
                      <stop offset="78%" stopColor="#f97316" stopOpacity="0.9" />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#991b1b" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="areaGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Intensity Grid Lines */}
                  <line x1="42" y1="20" x2="720" y2="20" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="42" y1="55" x2="720" y2="55" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="42" y1="90" x2="720" y2="90" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="42" y1="125" x2="720" y2="125" stroke="#334155" strokeWidth="1.2" />

                  {/* Vertical Wavelength Grid Lines */}
                  {[400, 450, 500, 550, 600, 650, 700].map(wl => {
                    const xPos = 42 + ((wl - 380) / (750 - 380)) * 678;
                    return (
                      <g key={wl}>
                        <line x1={xPos} y1="15" x2={xPos} y2="125" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="1" />
                        <text x={xPos} y="139" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                          {wl}
                        </text>
                      </g>
                    );
                  })}

                  {/* Y Axis Intensity Labels */}
                  <text x="36" y="24" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">100%</text>
                  <text x="36" y="59" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">75%</text>
                  <text x="36" y="94" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">50%</text>
                  <text x="36" y="128" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">0%</text>

                  {/* Generated Mathematical Curve Path */}
                  {(() => {
                    const points: { x: number; y: number }[] = [];
                    const step = 2; // nm
                    const minWl = 380;
                    const maxWl = 750;
                    const plotW = 678;
                    const plotH = 105;
                    const baseY = 125;

                    const excitationFactor = Math.max(0.2, Math.min(1.0, (temperature - 450) / 950));

                    for (let wl = minWl; wl <= maxWl; wl += step) {
                      let intensity = 0; // 0 to 100

                      // Continuous thermal Planck radiation baseline
                      if (isIgnited) {
                        const wienFactor = Math.max(0, 1 - Math.abs(wl - wienLambdaPeak) / 850);
                        intensity += 3 + wienFactor * 10 * (temperature / 1500);
                      }

                      if (spectrumMode === 'emission') {
                        // Gaussian Peaks for Active Spectral Lines
                        visibleSpectralLines.forEach(line => {
                          const dist = Math.abs(wl - line.lambda);
                          if (dist < 15) {
                            const sigma = 3.2; // nm width
                            const peakHeight = 85 * excitationFactor;
                            intensity += peakHeight * Math.exp(-(dist * dist) / (2 * sigma * sigma));
                          }
                        });
                        intensity = Math.min(98, intensity);
                      } else {
                        // Absorption Fraunhofer dips
                        intensity = 86;
                        visibleSpectralLines.forEach(line => {
                          const dist = Math.abs(wl - line.lambda);
                          if (dist < 12) {
                            const sigma = 2.8;
                            const dipDepth = 75;
                            intensity -= dipDepth * Math.exp(-(dist * dist) / (2 * sigma * sigma));
                          }
                        });
                        intensity = Math.max(5, intensity);
                      }

                      const px = 42 + ((wl - minWl) / (maxWl - minWl)) * plotW;
                      const py = baseY - (intensity / 100) * plotH;
                      points.push({ x: px, y: py });
                    }

                    if (points.length === 0) return null;

                    const pathD = points.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
                    const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${baseY} L ${points[0].x.toFixed(1)} ${baseY} Z`;

                    return (
                      <>
                        {/* Shaded Area under Curve */}
                        <path d={areaD} fill="url(#areaGlowGrad)" />
                        <path d={areaD} fill="url(#spectrumCurveGrad)" opacity="0.25" />
                        
                        {/* Neon Curve Path */}
                        <path 
                          d={pathD} 
                          fill="none" 
                          stroke="url(#spectrumCurveGrad)" 
                          strokeWidth="2.4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />

                        {/* Interactive Markers for Each Spectral Line Peak */}
                        {visibleSpectralLines.map((line, lIdx) => {
                          const lX = 42 + ((line.lambda - minWl) / (maxWl - minWl)) * plotW;
                          const isSelected = selectedQuantumLine?.lambda === line.lambda;
                          const lCol = wavelengthToColor(line.lambda);
                          const peakIntensity = spectrumMode === 'emission' ? (85 * excitationFactor) : 15;
                          const lY = baseY - (peakIntensity / 100) * plotH;

                          return (
                            <g 
                              key={lIdx} 
                              className="cursor-pointer group"
                              onClick={() => setSelectedQuantumLine(isSelected ? null : line)}
                            >
                              <line x1={lX} y1={lY} x2={lX} y2={baseY} stroke={lCol.hex} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                              <circle 
                                cx={lX} 
                                cy={lY} 
                                r={isSelected ? 6 : 4} 
                                fill={lCol.hex} 
                                stroke="#ffffff" 
                                strokeWidth={isSelected ? 2 : 1}
                                className={isSelected ? 'animate-pulse' : ''}
                              />
                              <text 
                                x={lX} 
                                y={Math.max(12, lY - 7)} 
                                fill={lCol.hex} 
                                fontSize="9" 
                                fontFamily="monospace" 
                                fontWeight="bold" 
                                textAnchor="middle"
                              >
                                {line.lambda} nm
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          )}

          {/* INTERACTIVE CLICKABLE PILL BUTTONS FOR DETECTED LINES */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--stroke-default)] mt-1">
            <span className="text-[11px] font-mono font-semibold flex items-center gap-1 shrink-0">
              <Atom className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
              <span className="card-title-gradient font-bold">Raies spectrales :</span>
            </span>

            {visibleSpectralLines.length > 0 ? (
              visibleSpectralLines.map((line, idx) => {
                const isSelected = selectedQuantumLine?.lambda === line.lambda;
                const lineColor = wavelengthToColor(line.lambda);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedQuantumLine(isSelected ? null : line)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                      isSelected 
                        ? 'border-white scale-105 shadow-md' 
                        : 'bg-[var(--surface-dim)] text-[var(--on-surface)] border-[var(--stroke-default)] hover:bg-[var(--surface)]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? lineColor.hex : undefined,
                      borderColor: isSelected ? '#ffffff' : undefined,
                      boxShadow: isSelected ? `0 0 14px ${lineColor.hex}cc` : undefined,
                      color: isSelected ? ((lineColor.r * 0.299 + lineColor.g * 0.587 + lineColor.b * 0.114 > 140) ? '#090b10' : '#ffffff') : undefined
                    }}
                    title={`Cliquez pour ouvrir la fiche quantique (${lineColor.name})`}
                  >
                    <span 
                      className={`w-2.5 h-2.5 rounded-full border border-black/40 ${isSelected ? 'animate-ping' : ''}`} 
                      style={{ 
                        backgroundColor: lineColor.hex,
                        boxShadow: `0 0 8px ${lineColor.hex}` 
                      }} 
                    />
                    <span>{line.label}</span>
                    <span className="text-[10px] opacity-80 font-normal">({line.energyEv} eV)</span>
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-[var(--on-surface-variant)] italic">
                Spectre continu de corps noir (Wien : {wienLambdaPeak} nm) — Ouvrez la virole d'air (&gt; 30%) pour observer les bandes des radicaux CH* et C₂ du dard bleu, ou sélectionnez un additif chimique.
              </span>
            )}
          </div>

          {/* QUANTUM SPECTRAL LINE DETAILS CARD EMBEDDED DIRECTLY HERE */}
          {selectedQuantumLine && (() => {
            const qColor = wavelengthToColor(selectedQuantumLine.lambda);
            return (
              <div 
                className="mt-2 p-3.5 bg-[var(--surface-dim)] rounded-xl border-2 shadow-lg flex flex-col gap-2.5 transition-all animate-in fade-in" 
                style={{ borderColor: qColor.hex, boxShadow: `0 0 18px ${qColor.hex}35` }}
              >
                <div className="flex items-center justify-between border-b border-[var(--stroke-default)] pb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_0_8px_currentColor]" 
                      style={{ backgroundColor: qColor.hex, color: qColor.hex }} 
                    />
                    <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <span className="card-title-gradient">Fiche Quantique : {selectedQuantumLine.label}</span>
                    </h4>
                    <span 
                      className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/20"
                      style={{ 
                        backgroundColor: `${qColor.hex}25`, 
                        color: qColor.hex 
                      }}
                    >
                      Teinte : {qColor.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedQuantumLine(null)}
                    className="p-1 rounded-md hover:bg-[var(--surface)] text-[var(--on-surface-variant)] cursor-pointer"
                    title="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[var(--surface)] border border-[var(--stroke-default)] flex flex-col">
                    <span className="text-[var(--on-surface-variant)] text-[10px]">Longueur d'onde (λ)</span>
                    <span className="font-bold text-sm flex items-center gap-1.5" style={{ color: qColor.hex }}>
                      <span>{selectedQuantumLine.lambda} nm</span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: qColor.hex, boxShadow: `0 0 6px ${qColor.hex}` }} />
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[var(--surface)] border border-[var(--stroke-default)] flex flex-col">
                    <span className="text-[var(--on-surface-variant)] text-[10px]">Énergie photon (E)</span>
                    <span className="font-bold text-amber-400 text-sm">{selectedQuantumLine.energyEv} eV</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--surface)] border border-[var(--stroke-default)] flex flex-col">
                    <span className="text-[var(--on-surface-variant)] text-[10px]">Fréquence (ν)</span>
                    <span className="font-bold text-emerald-400 text-sm">{selectedQuantumLine.frequencyThz} THz</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--surface)] border border-[var(--stroke-default)] flex flex-col">
                    <span className="text-[var(--on-surface-variant)] text-[10px]">Transition orbitale</span>
                    <span className="font-bold text-pink-400 text-xs sm:text-sm truncate">{selectedQuantumLine.transition}</span>
                  </div>
                </div>

                <p className="text-xs text-[var(--on-surface-variant)] bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--stroke-default)] leading-relaxed">
                  <strong className="text-[var(--on-surface)]">Phénomène physique : </strong> 
                  {selectedQuantumLine.description}
                </p>
              </div>
            );
          })()}
        </div>

        {/* Chemical Additive 3D Buttons With Multi-Elements Mix Toggle */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm sm:text-base font-semibold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-pink-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
              <span className="card-title-gradient font-bold">Additifs chimiques (Test de flamme)</span>
            </span>

            {/* Toggle Pyrotechnie / Mix Mode */}
            <button
              type="button"
              onClick={() => {
                setIsMixMode(!isMixMode);
                if (isMixMode) {
                  setMixedElements([chemicalElement]);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer border ${
                isMixMode 
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]' 
                  : 'bg-[var(--surface)] text-[var(--on-surface-variant)] border-[var(--stroke-default)] hover:text-[var(--on-surface)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mode Pyrotechnie (Mélange) : {isMixMode ? 'ACTIF' : 'INACTIF'}</span>
            </button>
          </div>

          <p className="text-xs text-[var(--on-surface-variant)]">
            {isMixMode 
              ? 'Sélectionnez plusieurs éléments pour observer la superposition des spectres et des couleurs !' 
              : 'Cliquez sur un élément pour observer son émission spectrale atomique.'}
          </p>

          {/* 3D CHEMICAL BUTTONS */}
          <div className="flex flex-wrap gap-3 sm:gap-3.5 pt-2 pb-1">
            {Object.keys(CHEMICAL_DATA).map((elemKey) => {
              const chem = CHEMICAL_DATA[elemKey];
              const isActive = isMixMode 
                ? mixedElements.includes(elemKey) 
                : chemicalElement === elemKey;

              return (
                <button
                  key={elemKey}
                  type="button"
                  onClick={() => handleChemicalClick(elemKey)}
                  className={`chemical-chip-3d ${chem.chipClass} transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'is-active ring-4 ring-white ring-offset-2 ring-offset-[#090b10] scale-105 z-10' 
                      : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'
                  }`}
                  aria-pressed={isActive}
                >
                  {/* ILLUMINATED GLOWING BEACON DOT */}
                  <span className="relative flex items-center justify-center shrink-0">
                    {/* Pulsing light wave when active */}
                    {isActive && (
                      <span
                        className="absolute -inset-1 rounded-full animate-ping opacity-80"
                        style={{ backgroundColor: chem.dotColor }}
                      />
                    )}
                    {/* The Dot: grows to 16px with crisp white border and intense neon glow */}
                    <span
                      className={`rounded-full transition-all duration-200 ${
                        isActive 
                          ? 'w-4 h-4 border-2 border-white shadow-[0_0_12px_#ffffff]' 
                          : 'w-2.5 h-2.5 border border-black/30'
                      }`}
                      style={{ 
                        backgroundColor: chem.dotColor,
                        boxShadow: isActive ? `0 0 10px #ffffff, 0 0 20px ${chem.dotColor}, 0 0 30px ${chem.dotColor}` : undefined
                      }}
                    />
                  </span>

                  {/* Label */}
                  <span className={`tracking-wide ${isActive ? 'font-black' : 'font-semibold'}`}>
                    {chem.label}
                  </span>

                  {/* Unmistakable Selection Badge Indicator */}
                  {isActive && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/80 text-[10px] font-mono font-black text-white border border-white/80 shadow flex items-center gap-0.5">
                      ✓ ACTIF
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* Social Media Card: YouTube & TikTok Links */}
      <section 
        className="p-4 sm:p-5 rounded-xl border-2 shadow-lg flex flex-col gap-4 transition-all duration-300 relative overflow-hidden text-slate-950"
        style={{ 
          background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 25%, #818cf8 50%, #c084fc 75%, #ec4899 100%)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 30px rgba(6, 182, 212, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/15 pb-3">
          <div className="flex flex-col">
            <h3 className="font-black text-base sm:text-lg flex items-center gap-2 text-black">
              <Link2 className="w-5 h-5 text-black drop-shadow-sm" />
              <span className="text-black font-black tracking-tight">Communauté &amp; Réseaux Sociaux</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-950 font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]">
              Retrouvez toutes nos vidéos sur Youtube et Tiktok, clique sur le lien et n'oublie pas de t'abonner pour plus de contenus
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isEditingSocials) {
                saveSocialLinks();
              } else {
                setDraftYoutube(youtubeUrl);
                setDraftTiktok(tiktokUrl);
                setIsEditingSocials(true);
              }
            }}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-black/20 bg-white/90 hover:bg-white text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm hover:shadow cursor-pointer backdrop-blur-sm"
          >
            {isEditingSocials ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enregistrer</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5 text-slate-900" />
                <span>Modifier mes liens</span>
              </>
            )}
          </button>
        </div>

        {isEditingSocials && (
          <form onSubmit={saveSocialLinks} className="flex flex-col gap-3 p-3.5 bg-white/90 backdrop-blur-md rounded-xl border-2 border-black/20 text-slate-950 transition-all duration-300 shadow-md">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold flex items-center gap-1.5 text-black">
                <Youtube className="w-4 h-4 text-red-600" />
                <span className="text-slate-950 font-bold">Lien de votre chaîne YouTube :</span>
              </label>
              <input
                type="url"
                value={draftYoutube}
                onChange={(e) => setDraftYoutube(e.target.value)}
                placeholder="https://www.youtube.com/@votre_chaine"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-red-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold flex items-center gap-1.5 text-black">
                <span className="w-4 h-4 rounded-full bg-black border border-pink-500/50 flex items-center justify-center font-bold text-[9px] text-pink-400">TT</span>
                <span className="text-slate-950 font-bold">Lien de votre compte TikTok :</span>
              </label>
              <input
                type="url"
                value={draftTiktok}
                onChange={(e) => setDraftTiktok(e.target.value)}
                placeholder="https://www.tiktok.com/@votre_compte"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:border-pink-500 transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingSocials(false)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-950 hover:bg-black text-white transition shadow cursor-pointer"
              >
                Valider mes liens
              </button>
            </div>
          </form>
        )}

        {/* Bottom Row: 3D Social Buttons on Left, Official Logo on Right */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pt-1">
          {/* 3D Social Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* YouTube 3D Button */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-social-3d btn-youtube-3d"
              title="Accéder à la chaîne YouTube"
            >
              <Youtube className="w-5 h-5 text-white shrink-0" />
              <span>Chaîne YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* TikTok 3D Button */}
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-social-3d btn-tiktok-3d"
              title="Accéder au compte TikTok"
            >
              {/* TikTok Icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.41a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 15.69a6.34 6.34 0 0 0 6.34 6.35 6.34 6.34 0 0 0 6.34-6.35V9.08a8.28 8.28 0 0 0 3.81.93V6.69z" />
              </svg>
              <span>Compte TikTok</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* EXACT OFFICIAL LOGO IN BOTTOM RIGHT */}
          <div className="flex flex-col items-center sm:items-end gap-1 shrink-0">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <div
              onClick={() => logoInputRef.current?.click()}
              className="relative group cursor-pointer w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-300 hover:scale-105 select-none"
              title="Logo officiel Frappes Cérébrales (Cliquez pour charger la photo exacte)"
            >
              {exactLogo ? (
                /* EXACT UPLOADED LOGO WITH TRANSPARENT CUTOUT SO BACKGROUND SHINES THROUGH */
                <img
                  src={exactLogo}
                  alt="Logo officiel Frappes Cérébrales"
                  onError={() => setExactLogo(null)}
                  className="relative w-full h-full object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
                />
              ) : (
                /* HIGH-FIDELITY VECTOR MEDALLION MATCHING IMG_9555 */
                <div
                  className="relative w-full h-full rounded-full border-2 bg-transparent flex items-center justify-center overflow-hidden drop-shadow-xl"
                  style={{ borderColor: statusDotColor }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="logoBrain" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff758f" />
                        <stop offset="50%" stopColor="#e63946" />
                        <stop offset="100%" stopColor="#a4133c" />
                      </linearGradient>
                      <linearGradient id="logoRim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <path
                        id="logoArcText"
                        d="M 22 135 A 80 80 0 0 0 178 135"
                        fill="none"
                      />
                    </defs>

                    {/* Outer Cybernetic Ring */}
                    <circle cx="100" cy="100" r="95" fill="#0d1424" stroke="url(#logoRim)" strokeWidth="3" />
                    <circle cx="100" cy="100" r="88" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

                    {/* Silver Studs / Rivets */}
                    <circle cx="100" cy="16" r="4.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                    <circle cx="65" cy="25" r="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="135" cy="25" r="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="38" cy="46" r="3.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                    <circle cx="162" cy="46" r="3.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />

                    {/* Brain Fist Anatomy */}
                    <g transform="translate(100, 80) scale(0.9)">
                      {/* Left Fist Lobe */}
                      <path
                        d="M -10 -35 C -35 -35 -60 -18 -60 12 C -60 30 -48 42 -35 45 C -25 47 -15 42 -8 38 Z"
                        fill="url(#logoBrain)"
                        stroke="#ffb3c1"
                        strokeWidth="2"
                      />
                      {/* Right Fist Lobe */}
                      <path
                        d="M 10 -35 C 35 -35 60 -18 60 12 C 60 30 48 42 35 45 C 25 47 15 42 8 38 Z"
                        fill="url(#logoBrain)"
                        stroke="#ffb3c1"
                        strokeWidth="2"
                      />

                      {/* Supporting Hand Base */}
                      <path
                        d="M -20 35 C -15 48 15 48 20 35 C 32 34 42 45 28 54 C 5 62 -5 62 -28 54 C -42 45 -32 34 -20 35 Z"
                        fill="#334155"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />

                      {/* Sulci (Convolutions) */}
                      <path
                        d="M -45 -10 C -35 0 -22 -5 -12 -14 M -50 12 C -38 18 -26 8 -16 17 M -38 28 C -26 23 -15 30 -8 24"
                        fill="none"
                        stroke="#590d22"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 45 -10 C 35 0 22 -5 12 -14 M 50 12 C 38 18 26 8 16 17 M 38 28 C 26 23 15 30 8 24"
                        fill="none"
                        stroke="#590d22"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Electric Synaptic Sparks */}
                      <path
                        d="M 0 -30 L -3 -12 L 4 -3 L -2 12 L 0 30"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="0" cy="-3" r="4" fill="#ffffff" />
                      <circle cx="-10" cy="10" r="2.5" fill="#38bdf8" />
                      <circle cx="10" cy="5" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* Curving 3D Inscribed Text */}
                    <text
                      fill="#38bdf8"
                      fontSize="14.5"
                      fontWeight="900"
                      letterSpacing="3"
                      className="font-sans font-black"
                    >
                      <textPath href="#logoArcText" startOffset="50%" textAnchor="middle">
                        FRAPPES CÉRÉBRALES
                      </textPath>
                    </text>
                  </svg>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-[10px] font-mono text-slate-950 font-bold hover:text-black underline cursor-pointer"
              >
                {exactLogo ? "Changer le logo" : "Charger mon logo exact"}
              </button>
              {exactLogo && exactLogo !== OFFICIAL_LOGO_SRC && (
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.removeItem('user_logo_image'); } catch {}
                    setExactLogo(OFFICIAL_LOGO_SRC);
                  }}
                  className="text-[10px] font-mono text-slate-800 hover:text-black underline cursor-pointer"
                  title="Revenir au logo officiel détouré"
                >
                  (Réinitialiser)
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
