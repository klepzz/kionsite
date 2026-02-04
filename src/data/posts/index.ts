import { Post } from "../../types/post";

// Travel Posts
import { post as cappadocia } from "./cappadocia-travel-guide";
import { post as norway } from "./norway-fjords-guide";
import { post as japan } from "./japan-hidden-villages";
import { post as patagonia } from "./patagonia-travel-guide-wilderness";
import { post as iceland } from "./iceland-ring-road-itinerary-guide";
import { post as amalfi } from "./amalfi-coast-italy-travel-guide";
import { post as bhutan } from "./bhutan-travel-guide-happiness-monastery";
import { post as serengeti } from "./serengeti-safari-great-migration-guide";
import { post as santorini } from "./santorini-greece-travel-guide-volcano";
import { post as socotra } from "./travel-socotra-island-dragon-blood";
import { post as transSiberian } from "./travel-trans-siberian-railway-journey";
import { post as atacama } from "./travel-atacama-desert-stargazing";

// Science Posts
import { post as jamesWebb } from "./james-webb-discoveries";
import { post as mars } from "./life-on-mars-colony";
import { post as crispr } from "./crispr-genetic-engineering";
import { post as aiEthics } from "./ai-ethics-debate";
import { post as spaceTourism } from "./future-of-space-tourism";
import { post as deepSea } from "./deep-sea-twilight-zone";
import { post as fermi } from "./fermi-paradox-great-silence";
import { post as mycelium } from "./mycelium-wood-wide-web";

// Technology Posts
import { post as vrEducation } from "./vr-revolutionizing-education";
import { post as quantum } from "./quantum-computing-power";
import { post as fiveG } from "./5g-smart-cities";
import { post as blockchain } from "./blockchain-beyond-crypto";
import { post as neuralink } from "./tech-neuralink-brain-interface";
import { post as biophilic } from "./tech-biophilic-design-green-silicon";
import { post as synBio } from "./tech-synthetic-biology-coding-life";

// Sport Posts
import { post as running } from "./psychological-benefits-running";
import { post as homeWorkout } from "./home-workout-guide";
import { post as hiit } from "./science-of-hiit-workout";
import { post as nutrition } from "./athletic-nutrition-performance-guide";
import { post as championMindset } from "./psychology-of-peak-athletic-performance";
import { post as esports } from "./rise-of-esports-professional-gaming";
import { post as recovery } from "./science-of-sports-recovery-repair";
import { post as extremeSports } from "./extreme-sports-psychology-adrenaline-flow";
import { post as f1Physics } from "./f1-physics-speed";
import { post as ultraRunning } from "./ultramarathon-mind-running";
import { post as tennisInner } from "./tennis-inner-game";

// Psychology Posts
import { post as procrastination } from "./overcoming-procrastination";
import { post as habits } from "./neuroscience-of-habits";
import { post as cognitiveBiases } from "./cognitive-biases-judgment";
import { post as flow } from "./psychology-of-flow-state";
import { post as emotionalIntelligence } from "./emotional-intelligence-success";
import { post as sleep } from "./science-of-sleep-dreams";
import { post as mindfulness } from "./mindfulness-science-mental-health";
import { post as loneliness } from "./psychology-loneliness-digital-age";
import { post as creativeBlock } from "./psychology-creative-block-stagnation";
import { post as nostalgia } from "./psychology-nostalgia-benefits";


// Evergreen New Posts
import { post as aiGuide } from "./what-is-artificial-intelligence-2026";
import { post as burnout } from "./burnout-syndrome-recovery-guide";
import { post as fasting } from "./intermittent-fasting-guide-2026";

export const allPosts: Post[] = [
    // Evergreen / Featured
    aiGuide, burnout, fasting,

    // Travel
    cappadocia, norway, japan, patagonia, iceland, amalfi, bhutan, serengeti, santorini, socotra, transSiberian, atacama,
    // Science
    jamesWebb, mars, crispr, aiEthics, spaceTourism, deepSea, fermi, mycelium,
    // Technology
    vrEducation, quantum, fiveG, blockchain, neuralink, biophilic, synBio,
    // Sport
    running, homeWorkout, hiit, nutrition, championMindset, esports, recovery, extremeSports, f1Physics, ultraRunning, tennisInner,
    // Psychology
    procrastination, habits, cognitiveBiases, flow, emotionalIntelligence, sleep, mindfulness, loneliness, creativeBlock, nostalgia
];
