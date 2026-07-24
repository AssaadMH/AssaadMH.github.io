/* =============================================================================
   data.js — ALL portfolio content lives here.
   To edit the site you only ever need to touch this file.

   Every text is written as  { en: "...", fr: "..." }
   ========================================================================== */

const PROFILE = {
  // ---- EDIT THESE -----------------------------------------------------------
  name: "Lassaad Mahmoudi",
  initials: "LM",
  email: "contact@iris-systems.tn",
  phone: "+216 23 315 873",
  github: "",                       // e.g. "https://github.com/username"
  linkedin: "https://linkedin.com/in/mahmoudiassaad",
  // ---------------------------------------------------------------------------

  role: {
    en: "Robotics &amp; Embedded Systems Engineering Student",
    fr: "Étudiant ingénieur — Robotique &amp; Systèmes embarqués"
  },
  school: {
    en: "National Engineering School of Gabès (ENIG) — University of Gabès, Tunisia",
    fr: "École Nationale d'Ingénieurs de Gabès (ENIG) — Université de Gabès, Tunisie"
  },
  location: { en: "Tunisia", fr: "Tunisie" },

  tagline: {
    en: "I build machines that have to work in the physical world — autonomous ground vehicles, motor control, lidar perception, and the enclosures and brackets that hold them together. Every project below runs on real hardware, and every number on this page was measured, not estimated.",
    fr: "Je construis des machines destinées au monde réel — véhicules terrestres autonomes, commande de moteurs, perception lidar, ainsi que les boîtiers et supports qui les assemblent. Chaque projet ci-dessous tourne sur du matériel réel, et chaque chiffre de cette page a été mesuré, pas estimé."
  },

  stats: [
    { value: "ROS 2", label: { en: "Autonomy stack", fr: "Pile d'autonomie" } },
    { value: "STM32", label: { en: "Firmware in C", fr: "Firmware en C" } },
    { value: "4WD", label: { en: "UGV on 52 V", fr: "UGV en 52 V" } },
    { value: "16", label: { en: "Documented projects", fr: "Projets documentés" } }
  ]
};

/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  { id: "all",        label: { en: "All projects",  fr: "Tous les projets" } },
  { id: "robotics",   label: { en: "Robotics",      fr: "Robotique" } },
  { id: "embedded",   label: { en: "Embedded",      fr: "Embarqué" } },
  { id: "mechanical", label: { en: "Mechanical / CAD", fr: "Mécanique / CAO" } },
  { id: "electronics",label: { en: "Electronics",   fr: "Électronique" } },
  { id: "software",   label: { en: "Software",      fr: "Logiciel" } }
];

/* -------------------------------------------------------------------------- */

const PROJECTS = [

  /* ===================================================================== 1 */
  {
    id: "shadow",
    featured: true,
    cats: ["robotics", "embedded", "software"],
    year: "2026",
    title: { en: "SHADOW — Autonomous 4WD Ground Vehicle", fr: "SHADOW — Véhicule terrestre autonome 4×4" },
    subtitle: {
      en: "NVIDIA Jetson Orin Nano + STM32, ROS 2, lidar and RGB-D perception on a 52 V hub-motor platform.",
      fr: "NVIDIA Jetson Orin Nano + STM32, ROS 2, perception lidar et RGB-D sur une plateforme 52 V à moteurs-roues."
    },
    images: ["shadow-perfboard.png", "shadow-schema.png"],
    tags: ["ROS 2", "Jetson Orin Nano", "STM32 F446RE / F401", "Isaac ROS", "C", "Python", "BLDC", "Linux"],
    body: {
      en: [
        "A full-size four-wheel-drive robot built from scratch: an NVIDIA Jetson Orin Nano as the compute brain, an STM32 Nucleo as the real-time motor MCU, and four generic 48–64 V BLDC hub-motor controllers on a 52 V pack. Throttle and reverse work on all four wheels.",
        "<b>Motor control.</b> Each throttle line is filtered through a 1 kΩ + 10 µF RC network into the controller, and each reverse line is driven through a 2N2222 inverter. The controllers only latch reverse at a standstill, so the firmware implements an explicit stop → settle (1000 ms) → reverse-throttle sequence. A bench safety cap limits duty to 216/255 while the wheels are raised. Odometry was calibrated against tape measurements to 0.0232 m per pulse.",
        "<b>ROS 2 architecture.</b> I replaced an early monolithic gamepad bridge with a layered, hardware-verified stack: <code>motor_driver</code> (subscribes <code>cmd_vel</code>, <code>brake</code> and <code>cmd_raw</code>, holds a 0.5 s watchdog, talks serial to the STM32), <code>motor_teleop</code> (DualSense → <code>cmd_vel</code>), and <code>motor_bringup</code> (launch files and controller config). The old monolith was kept intact as a rollback path.",
        "<b>Perception.</b> A YDLidar X2 publishes scans through a ROS 2 driver with tuned parameters — the enable-motor gotcha turned out to be a serial DTR toggle. Two Xbox 360 Kinects supply RGB + depth over libfreenect plus a 4-microphone array via ALSA. On the Orin Nano, DetectNet, ESS stereo depth and U-Net from the Isaac ROS stack were deployed and verified.",
        "<b>Voice control.</b> Multilingual (FR / EN / AR) speech nodes map spoken commands directly to <code>cmd_vel</code>.",
        "<b>The engineering lesson.</b> An electrical hold-brake I built caught fire. The root cause was not an undersized part but a topology fault: the controller's thin \"antivol\" blue/yellow pair is a <i>motor phase</i>, not a signal line, carrying 52 V PWM and generator current. Any logic-ground-referenced MOSFET or optocoupler placed across it is a permanent half-wave short. I documented the full post-mortem and moved the design to a fail-safe, spring-applied mechanical brake with zero electrical connection to the phases — which became the next project on this page."
      ],
      fr: [
        "Un robot 4×4 grandeur nature conçu de zéro : un NVIDIA Jetson Orin Nano comme cerveau de calcul, un STM32 Nucleo comme microcontrôleur moteur temps réel, et quatre variateurs BLDC 48–64 V pour moteurs-roues alimentés par un pack 52 V. Marche avant et marche arrière fonctionnent sur les quatre roues.",
        "<b>Commande moteur.</b> Chaque ligne d'accélération passe par un filtre RC 1 kΩ + 10 µF vers le variateur, et chaque ligne de marche arrière est pilotée via un inverseur 2N2222. Les variateurs ne verrouillent la marche arrière qu'à l'arrêt : le firmware applique donc une séquence explicite arrêt → stabilisation (1000 ms) → accélération inverse. Un plafond de sécurité limite le rapport cyclique à 216/255 tant que les roues sont levées. L'odométrie a été calibrée au mètre-ruban à 0,0232 m par impulsion.",
        "<b>Architecture ROS 2.</b> J'ai remplacé un pont manette monolithique par une pile en couches, validée sur matériel : <code>motor_driver</code> (souscrit à <code>cmd_vel</code>, <code>brake</code> et <code>cmd_raw</code>, chien de garde de 0,5 s, liaison série vers le STM32), <code>motor_teleop</code> (DualSense → <code>cmd_vel</code>) et <code>motor_bringup</code> (fichiers de lancement et configuration). L'ancien monolithe a été conservé comme solution de repli.",
        "<b>Perception.</b> Un YDLidar X2 publie ses scans via un driver ROS 2 paramétré — le piège d'activation du moteur s'est révélé être une bascule DTR sur le port série. Deux Kinect Xbox 360 fournissent RGB + profondeur via libfreenect ainsi qu'un réseau de 4 microphones via ALSA. Sur l'Orin Nano, DetectNet, la profondeur stéréo ESS et U-Net de la pile Isaac ROS ont été déployés et vérifiés.",
        "<b>Commande vocale.</b> Des nœuds multilingues (FR / EN / AR) traduisent directement la parole en <code>cmd_vel</code>.",
        "<b>La leçon d'ingénierie.</b> Un frein de maintien électrique que j'avais construit a pris feu. La cause n'était pas un composant sous-dimensionné mais une faute de topologie : la paire fine bleu/jaune « antivol » du variateur est une <i>phase moteur</i>, pas une ligne de signal ; elle transporte du PWM 52 V et du courant de génératrice. Tout MOSFET ou optocoupleur référencé à la masse logique placé dessus constitue un court-circuit permanent en demi-alternance. J'ai rédigé le post-mortem complet et redirigé la conception vers un frein mécanique à sécurité positive, à ressort, sans aucune liaison électrique avec les phases — ce qui est devenu le projet suivant de cette page."
      ]
    }
  },

  /* ===================================================================== 2 */
  {
    id: "brake",
    featured: true,
    cats: ["mechanical", "robotics"],
    year: "2026",
    title: { en: "Fail-Safe Servo Brake Actuator", fr: "Actionneur de frein à sécurité positive" },
    subtitle: {
      en: "A printed drum that lets one servo pull two bicycle brake cables — the mechanical answer to an electrical failure.",
      fr: "Un tambour imprimé permettant à un seul servo de tirer deux câbles de frein de vélo — la réponse mécanique à une panne électrique."
    },
    images: ["brake-drum.png", "brake-horn.png"],
    tags: ["OpenSCAD", "Mechanism design", "FDM", "Force analysis"],
    body: {
      en: [
        "After the electrical hold-brake failure on SHADOW, the parking brake had to become purely mechanical. This actuator uses a TD-8130MG servo to pull two bicycle brake cables simultaneously through a printed cable drum.",
        "<b>The key design decision</b> is that the drum <i>captures the servo's stock metal horn</i> rather than reproducing its 25-tooth spline. A 25T spline printed in PLA strips under load; a captured horn puts the torque into steel and reduces the plastic's job to holding it.",
        "<b>Force analysis drove the geometry.</b> Cable stroke and force trade off directly against each other for a fixed servo torque. The 70 mm stroke needed to fully actuate both calipers yields only 6.7 kg per cable — a number worth knowing before printing, not after. Cable stops and mounting blocks were designed alongside the drum and laid out on a single print plate.",
        "Every part was checked with an STL sanity script and a G-code verification pass before printing."
      ],
      fr: [
        "Après la défaillance du frein de maintien électrique de SHADOW, le frein de stationnement devait devenir purement mécanique. Cet actionneur utilise un servo TD-8130MG pour tirer simultanément deux câbles de frein de vélo via un tambour imprimé.",
        "<b>La décision de conception clé</b> est que le tambour <i>capture le palonnier métallique d'origine du servo</i> au lieu de reproduire ses cannelures à 25 dents. Une cannelure 25T imprimée en PLA s'arrache sous charge ; en capturant le palonnier, le couple passe par l'acier et le plastique n'a plus qu'à le maintenir.",
        "<b>L'analyse des efforts a dicté la géométrie.</b> Course et effort du câble s'échangent directement à couple servo fixe. La course de 70 mm nécessaire pour actionner complètement les deux étriers ne donne que 6,7 kg par câble — un chiffre à connaître avant l'impression, pas après. Butées de câble et blocs de fixation ont été conçus avec le tambour et disposés sur une seule plaque d'impression.",
        "Chaque pièce a été contrôlée par un script de vérification STL et une passe de vérification du G-code avant impression."
      ]
    }
  },

  /* ===================================================================== 3 */
  {
    id: "lidarbox",
    featured: true,
    cats: ["mechanical", "robotics"],
    year: "2026",
    title: { en: "Sealed Lidar Enclosure with 360° Optical Window", fr: "Boîtier lidar étanche à fenêtre optique 360°" },
    subtitle: {
      en: "Parametric OpenSCAD housing for a YDLIDAR X2 — three printed parts and a structural clear tube.",
      fr: "Boîtier paramétrique OpenSCAD pour YDLIDAR X2 — trois pièces imprimées et un tube transparent structurel."
    },
    images: ["lidarbox-assembly.png", "lidarbox-section.png"],
    tags: ["OpenSCAD", "Parametric CAD", "Tolerance analysis", "DFM", "Python"],
    body: {
      en: [
        "A weather-sealed enclosure for a YDLIDAR X2 and its driver board, designed around one hard constraint: <b>nothing may cross the scan plane.</b> Any post, screw or rib inside that band becomes a permanent blind sector in the point cloud, so the clear acrylic tube is not a cover — it is the load path between the base and the lid.",
        "<b>All geometry is measured, not guessed.</b> The lidar's dimensions come from the vendor's own CAD model, imported and measured, and are isolated in a single locked block of the source.",
        "<b>Key numbers:</b> 104.03 × 78.60 mm footprint, 79.5 mm tall. The free optical window spans z = 58.0 … 67.5 mm while the laser needs 59.30 … 64.00 mm, clearing both ends. Radial clearance around the rotating head inside the tube is 2.75 mm, and the lid underside sits 2.18 mm above the head.",
        "<b>Tolerance study.</b> Extruded acrylic at Ø70 carries +0.35/−1.05 mm on outside diameter and ±20 % on wall thickness — more variation than any sane press fit allows. So the tube groove is deliberately loose at 0.6 mm per side and a silicone bead takes up the slack, which also seals against dust and decouples the tube from the head's vibration. That makes diameter error forgiving, but wall error is not: wall thickness eats head clearance one-for-one.",
        "<b>Verification tooling.</b> I wrote a post-export checker that reports connected components with signed volume and bounding box per part. This caught a real failure: a subtracted chamfer cone sized wider than the lid was <i>severing</i> it into a body plus a floating ring. The file was manifold, plausibly sized, and invisible in the slicer's default view — only the component count exposed it."
      ],
      fr: [
        "Un boîtier étanche pour YDLIDAR X2 et sa carte, conçu autour d'une contrainte absolue : <b>rien ne doit traverser le plan de balayage.</b> Tout montant, vis ou nervure dans cette bande devient un secteur aveugle permanent dans le nuage de points ; le tube acrylique transparent n'est donc pas un capot — c'est le chemin d'effort entre la base et le couvercle.",
        "<b>Toute la géométrie est mesurée, pas estimée.</b> Les dimensions du lidar proviennent du modèle CAO du fabricant, importé et mesuré, et sont isolées dans un unique bloc verrouillé du code source.",
        "<b>Chiffres clés :</b> emprise 104,03 × 78,60 mm, hauteur 79,5 mm. La fenêtre optique libre s'étend de z = 58,0 à 67,5 mm alors que le laser exige 59,30 à 64,00 mm — dégagement des deux côtés. Le jeu radial autour de la tête rotative dans le tube est de 2,75 mm, et le dessous du couvercle se situe 2,18 mm au-dessus de la tête.",
        "<b>Étude de tolérances.</b> L'acrylique extrudé en Ø70 présente +0,35/−1,05 mm sur le diamètre extérieur et ±20 % sur l'épaisseur de paroi — plus de dispersion que n'en tolère un ajustement serré. La gorge du tube est donc volontairement lâche, à 0,6 mm par côté, et un joint silicone rattrape le jeu, ce qui étanchéifie aussi contre la poussière et découple le tube des vibrations de la tête. L'erreur de diamètre devient ainsi tolérable ; l'erreur de paroi ne l'est pas, car elle grignote directement le dégagement de la tête.",
        "<b>Outillage de vérification.</b> J'ai écrit un contrôleur post-export qui rapporte les composantes connexes avec volume signé et boîte englobante pour chaque pièce. Il a détecté une vraie défaillance : un cône de chanfrein soustrait, plus large que le couvercle, le <i>sectionnait</i> en un corps plus un anneau flottant. Le fichier était manifold, de taille plausible, et invisible dans la vue par défaut du trancheur — seul le compte de composantes l'a révélé."
      ]
    }
  },

  /* ===================================================================== 4 */
  {
    id: "linefollower",
    featured: true,
    cats: ["robotics", "embedded", "software"],
    year: "2026",
    title: { en: "Line-Following Robot + PID Simulator", fr: "Robot suiveur de ligne + simulateur PID" },
    subtitle: {
      en: "16-sensor PID follower, plus a Python simulator that tunes the gains from a photograph of the track.",
      fr: "Suiveur PID à 16 capteurs, et un simulateur Python qui règle les gains à partir d'une photo du circuit."
    },
    images: ["linefollower-plan.svg", "linefollower-path.svg"],
    tags: ["Arduino", "PID control", "Python", "OpenCV", "Simulation", "L298"],
    body: {
      en: [
        "A competition line follower: 16 QTR reflectance sensors across the front, two motors through an L298-class driver, and a PID loop running every ~2 ms. The sensor bar reports one number — where the line sits relative to centre — and the controller turns that into a differential wheel speed.",
        "<b>Firmware.</b> Beyond the PID itself, two behaviours make the same upload survive any track: <i>corner braking</i>, where base speed is reduced in proportion to steering effort so the robot slows into turns instead of overshooting, and <i>line recovery</i>, where losing the line triggers a pivot toward the side the line was last seen. I found and fixed six firmware bugs during bring-up.",
        "<b>The simulator is the interesting part.</b> Rather than tuning on the real robot, I wrote a Python simulator with <code>autotune</code>, <code>sweep</code> and <code>animate</code> modes. It settled on KP 0.030, KD 1.2, base speed 200, and produced two findings that changed how the robot is tuned: going faster means raising base speed while holding corner braking near 1.0 — raising corner braking only makes corners slower, it is a smoothness knob, not a speed one. And KD is loop-time dependent, because the derivative term is computed per iteration; the sketch prints its own average loop time so the gain can be rescaled.",
        "<b>From photo to plan.</b> A companion tool takes a top-down image of a real track, thresholds it, skeletonises it to a one-pixel centreline, builds a graph of straights and junctions, routes through it, and emits a speed profile — fast on straights, slow in tight curves — plus the path tokens for the maze firmware and an annotated SVG. The same vision front-end can load your real track straight into the simulator, so the gains are tuned for that track before the robot ever touches it."
      ],
      fr: [
        "Un suiveur de ligne de compétition : 16 capteurs de réflectance QTR à l'avant, deux moteurs via un driver de type L298 et une boucle PID exécutée toutes les ~2 ms. La barre de capteurs renvoie un seul nombre — la position de la ligne par rapport au centre — que le correcteur convertit en vitesse différentielle des roues.",
        "<b>Firmware.</b> Au-delà du PID, deux comportements permettent au même programme de survivre à n'importe quel circuit : le <i>freinage en virage</i>, où la vitesse de base est réduite proportionnellement à l'effort de braquage pour que le robot ralentisse à l'entrée du virage au lieu de le dépasser, et la <i>récupération de ligne</i>, où la perte de ligne déclenche un pivot vers le côté où elle a été vue en dernier. J'ai identifié et corrigé six bugs de firmware pendant la mise en service.",
        "<b>Le simulateur est la partie intéressante.</b> Plutôt que de régler sur le robot réel, j'ai écrit un simulateur Python avec des modes <code>autotune</code>, <code>sweep</code> et <code>animate</code>. Il a convergé vers KP 0,030, KD 1,2, vitesse de base 200, et a produit deux conclusions qui ont changé la méthode de réglage : pour aller plus vite il faut augmenter la vitesse de base en gardant le freinage en virage proche de 1,0 — l'augmenter ne fait que ralentir les virages, c'est un réglage de douceur, pas de vitesse. Et KD dépend du temps de boucle, car le terme dérivé est calculé par itération ; le programme affiche son propre temps de boucle moyen pour permettre le rééchelonnement du gain.",
        "<b>De la photo au plan.</b> Un outil complémentaire prend une image du circuit vue de dessus, la seuille, la squelettise en une ligne centrale d'un pixel, construit un graphe de segments droits et de jonctions, calcule un itinéraire et produit un profil de vitesse — rapide en ligne droite, lent en virage serré — ainsi que les jetons de trajectoire pour le firmware de labyrinthe et un SVG annoté. La même chaîne de vision peut charger le circuit réel directement dans le simulateur, afin de régler les gains pour ce circuit avant que le robot ne le touche."
      ]
    }
  },

  /* ===================================================================== 5 */
  {
    id: "agv",
    featured: false,
    cats: ["robotics", "software"],
    year: "2026",
    title: { en: "Commercial AGV — Protocol Reverse-Engineering", fr: "AGV commercial — rétro-ingénierie du protocole" },
    subtitle: {
      en: "Mapping an undocumented HTTP control API on a warehouse AGV chassis, and diagnosing why auto-docking failed.",
      fr: "Cartographie d'une API HTTP non documentée sur un châssis AGV, et diagnostic de l'échec de l'accostage automatique."
    },
    images: [],
    tags: ["HTTP / REST", "Networking", "AGV", "Diagnostics", "Python"],
    body: {
      en: [
        "A commercial AGV chassis on the lab network shipped with no usable developer documentation. I probed its onboard service, mapped the control endpoints, and established a working command interface — motion commands and the auto-docking trigger — driving the chassis from my own scripts instead of the vendor app.",
        "<b>The diagnosis mattered more than the access.</b> Auto-docking kept failing, and the obvious conclusion was that the command was wrong. It was not. The robot was reporting 0 % localisation confidence and its saved map contained no charge-pile waypoint, so the dock command had nothing to navigate to. The fix belonged in mapping and localisation, not in the API layer.",
        "The exercise is a good illustration of a habit I try to keep: before blaming the interface you just learned, check whether the system underneath it has the state it needs."
      ],
      fr: [
        "Un châssis AGV commercial présent sur le réseau du laboratoire était livré sans documentation développeur exploitable. J'ai sondé son service embarqué, cartographié les points de terminaison de commande et établi une interface fonctionnelle — commandes de déplacement et déclenchement de l'accostage automatique — pilotant le châssis depuis mes propres scripts plutôt que l'application du fabricant.",
        "<b>Le diagnostic comptait plus que l'accès.</b> L'accostage automatique échouait systématiquement, et la conclusion évidente était que la commande était fausse. Elle ne l'était pas. Le robot annonçait 0 % de confiance de localisation et sa carte enregistrée ne contenait aucun point de passage vers la borne de charge : la commande d'accostage n'avait donc aucune destination. Le correctif relevait de la cartographie et de la localisation, pas de la couche API.",
        "L'exercice illustre bien une habitude que j'essaie de garder : avant d'accuser l'interface que l'on vient de découvrir, vérifier si le système sous-jacent dispose de l'état dont il a besoin."
      ]
    }
  },

  /* ===================================================================== 7 */
  {
    id: "alliance",
    featured: false,
    cats: ["embedded", "electronics", "robotics"],
    year: "2025",
    title: { en: "ALLIANCE — Competition Robot &amp; Custom Sensor PCB", fr: "ALLIANCE — Robot de compétition &amp; PCB capteur sur mesure" },
    subtitle: {
      en: "A 16-channel infrared line-sensor board I laid out myself, feeding an STM32 PID maze-solving car.",
      fr: "Une carte capteur infrarouge 16 voies que j'ai routée moi-même, alimentant une voiture STM32 PID résolveuse de labyrinthe."
    },
    images: [],
    tags: ["STM32", "Keil uVision", "Custom PCB", "Gerber", "TCRT5000", "PID", "ESP32", "MATLAB"],
    body: {
      en: [
        "A robotics-competition build centred on a piece of hardware I designed rather than bought: a <b>custom 16-channel TCRT5000 infrared sensor array</b>, taken from schematic through to my own Gerber files and layer artwork. Sixteen reflectance channels across the front give the controller a much finer read of line position than an off-the-shelf bar.",
        "<b>Control.</b> The car runs an STM32 firmware in Keil uVision with a PID steering loop and a maze-solving path routine, backed by encoder and BLDC bring-up sketches used to characterise the drivetrain before the full stack went on. An ESP32 Bluetooth node with speed-ramping handles manual drive. A MATLAB Live Script was used to study the follower's behaviour off the vehicle.",
        "The project is deliberately reported for what is mine — the sensor PCB, the PID car and the test firmware. Reference firmware I forked to study is kept separate and is not claimed as original work."
      ],
      fr: [
        "Une réalisation pour compétition robotique construite autour d'un matériel que j'ai conçu plutôt qu'acheté : un <b>réseau de capteurs infrarouges TCRT5000 16 voies sur mesure</b>, mené du schéma jusqu'à mes propres fichiers Gerber et plans de couches. Seize voies de réflectance à l'avant donnent au correcteur une lecture bien plus fine de la position de la ligne qu'une barre du commerce.",
        "<b>Commande.</b> La voiture exécute un firmware STM32 sous Keil uVision avec une boucle PID de direction et une routine de résolution de labyrinthe, appuyée par des programmes de mise en service encodeur et BLDC servant à caractériser la motorisation avant l'intégration complète. Un nœud ESP32 Bluetooth avec montée en vitesse progressive gère le pilotage manuel. Un Live Script MATLAB a servi à étudier le comportement du suiveur hors véhicule.",
        "Le projet est volontairement présenté pour ce qui m'appartient — le PCB capteur, la voiture PID et le firmware de test. Le firmware de référence que j'ai forké pour l'étudier est tenu à part et n'est pas revendiqué comme travail original."
      ]
    }
  },

  /* ===================================================================== 8 */
  {
    id: "kuka",
    featured: false,
    cats: ["robotics", "electronics"],
    year: "2025",
    title: { en: "Automated Sorting Cell — KUKA Robot + S7-1200 PLC", fr: "Cellule de tri automatisée — Robot KUKA + API S7-1200" },
    subtitle: {
      en: "An industrial pick-and-sort station: a KUKA arm sequenced by a Siemens S7-1200 PLC in Ladder, designed against recognised machine-safety standards.",
      fr: "Une station industrielle de préhension et de tri : un bras KUKA séquencé par un automate Siemens S7-1200 en Ladder, conçue selon les normes reconnues de sécurité machine."
    },
    images: [],
    tags: ["KUKA", "Siemens S7-1200", "Ladder / TIA", "ISO 13849-1", "IEC 62061", "Industrial automation"],
    body: {
      en: [
        "An industrial-automation project (with Chahin Dhaoui): an automated sorting cell built around a KUKA industrial robot that picks parts and sorts them by type, with a Siemens S7-1200 PLC as the cell controller and the two coordinated over their I/O handshake.",
        "<b>The control lives in the PLC.</b> The sequencing — part present, robot request, pick, place, sort-by-destination, cycle complete — is written in Ladder on the S7-1200, which is the language a maintenance team on a real line actually reads and modifies. The robot executes motion; the PLC owns the logic, the interlocks and the cycle.",
        "<b>Safety was a design input, not an afterthought.</b> The cell is specified against <b>ISO&nbsp;13849-1</b> and <b>IEC&nbsp;62061</b> — the standards that turn \"add an emergency stop\" into a quantified requirement on the safety function's performance level. Designing to them is the difference between a demo and something that could stand next to a person."
      ],
      fr: [
        "Un projet d'automatisation industrielle (avec Chahin Dhaoui) : une cellule de tri automatisée construite autour d'un robot industriel KUKA qui saisit des pièces et les trie par type, avec un automate Siemens S7-1200 comme contrôleur de cellule, les deux coordonnés via leur échange d'E/S.",
        "<b>La commande réside dans l'automate.</b> Le séquencement — pièce présente, requête robot, préhension, dépose, tri par destination, fin de cycle — est écrit en Ladder sur le S7-1200, le langage qu'une équipe de maintenance sur une vraie ligne lit et modifie réellement. Le robot exécute le mouvement ; l'automate détient la logique, les verrouillages et le cycle.",
        "<b>La sécurité était une donnée de conception, pas un ajout.</b> La cellule est spécifiée selon <b>ISO&nbsp;13849-1</b> et <b>IEC&nbsp;62061</b> — les normes qui transforment « ajouter un arrêt d'urgence » en une exigence quantifiée sur le niveau de performance de la fonction de sécurité. Concevoir selon elles, c'est la différence entre une démonstration et un système qui pourrait tenir à côté d'un opérateur."
      ]
    }
  },

  /* ===================================================================== 9 */
  {
    id: "face",
    featured: false,
    cats: ["software"],
    year: "2025",
    title: { en: "Real-Time Facial Recognition System", fr: "Système de reconnaissance faciale temps réel" },
    subtitle: {
      en: "OpenCV pipeline from dataset capture to live webcam recognition, with a documented ROC evaluation.",
      fr: "Chaîne OpenCV de la capture du jeu de données à la reconnaissance webcam en direct, avec évaluation ROC documentée."
    },
    images: [],
    tags: ["Python", "OpenCV", "LBPH", "Raspberry Pi 4", "Computer vision"],
    body: {
      en: [
        "A three-stage recognition pipeline built for a Raspberry Pi 4 target. Stage one captures and labels a face dataset from the camera; stage two trains a local recogniser and serialises the model and label map; stage three runs live inference on the webcam feed, drawing each detected face with its predicted identity and confidence score.",
        "Recognition uses a confidence threshold — below it the face is accepted as a known identity, above it it is reported as unknown — and each label is drawn in its own colour. The application supports enrolling a new person without restarting and capturing annotated screenshots for evidence.",
        "The classifier was evaluated with a documented ROC analysis rather than a single accuracy figure, which is what makes the confidence threshold a defensible choice instead of a guess."
      ],
      fr: [
        "Une chaîne de reconnaissance en trois étapes conçue pour une cible Raspberry Pi 4. La première capture et étiquette un jeu de données de visages depuis la caméra ; la deuxième entraîne un modèle local et sérialise le modèle et la table d'étiquettes ; la troisième exécute l'inférence en direct sur le flux webcam, en encadrant chaque visage détecté avec son identité prédite et son indice de confiance.",
        "La reconnaissance s'appuie sur un seuil de confiance — en dessous le visage est accepté comme identité connue, au-dessus il est signalé comme inconnu — et chaque étiquette est tracée dans sa propre couleur. L'application permet d'enrôler une nouvelle personne sans redémarrage et de capturer des captures d'écran annotées.",
        "Le classifieur a été évalué par une analyse ROC documentée plutôt que par un simple taux de réussite, ce qui fait du seuil de confiance un choix défendable et non une estimation."
      ]
    }
  },

  /* ===================================================================== 8 */
  {
    id: "unknown",
    featured: false,
    cats: ["software"],
    year: "2026",
    title: { en: "UNKNOWN — 3D Game on a 0.5 GB GPU", fr: "UNKNOWN — jeu 3D sur un GPU de 0,5 Go" },
    subtitle: {
      en: "A Godot game engineered around a hard hardware ceiling, with a normal-mapped lighting pipeline built to fit it.",
      fr: "Un jeu Godot conçu autour d'un plafond matériel strict, avec un pipeline d'éclairage normal-mappé taillé pour lui."
    },
    images: ["unknown-shrine.png", "unknown-room.png", "unknown-character.png"],
    tags: ["Godot 4.3", "GDScript", "Blender", "Shaders", "Performance"],
    body: {
      en: [
        "A personal game project whose real constraint is the target machine: a laptop GPU with roughly half a gigabyte of usable video memory, running Godot's GL Compatibility renderer. Everything is a performance decision.",
        "The first build was 2D — six rooms and a boss encounter — and is archived complete. The current build is 3D, measured at about 37 fps on the target hardware, which is what makes the move defensible rather than aspirational.",
        "<b>Lighting.</b> I proved out a normal-mapped 2.5D pipeline on the constrained renderer: sprite-based scenes lit as if they had real surface geometry, giving volumetric depth without the vertex and memory cost of true 3D. Asset generation is automated through Blender.",
        "<b>Measurement discipline.</b> Building performance harnesses for this taught me something I now apply everywhere: three of four verification scripts I wrote silently reported plausible but wrong numbers. The only reliable test of a measurement harness is to change a known-good input and confirm the number actually moves."
      ],
      fr: [
        "Un projet de jeu personnel dont la vraie contrainte est la machine cible : un GPU d'ordinateur portable disposant d'environ un demi-gigaoctet de mémoire vidéo utilisable, exécutant le moteur de rendu GL Compatibility de Godot. Tout y est une décision de performance.",
        "La première version était en 2D — six salles et un combat de boss — et est archivée complète. La version actuelle est en 3D, mesurée à environ 37 images par seconde sur le matériel cible, ce qui rend le choix défendable plutôt qu'ambitieux.",
        "<b>Éclairage.</b> J'ai validé un pipeline 2,5D normal-mappé sur ce moteur contraint : des scènes à base de sprites éclairées comme si elles possédaient une véritable géométrie de surface, offrant une profondeur volumétrique sans le coût en sommets et en mémoire de la vraie 3D. La génération des assets est automatisée via Blender.",
        "<b>Discipline de mesure.</b> Construire les bancs de test de performance m'a appris quelque chose que j'applique désormais partout : trois des quatre scripts de vérification que j'avais écrits rapportaient silencieusement des chiffres plausibles mais faux. Le seul test fiable d'un banc de mesure consiste à modifier une entrée connue et à vérifier que le chiffre bouge réellement."
      ]
    }
  },

  /* ===================================================================== 9 */
  {
    id: "brand",
    featured: false,
    cats: ["mechanical"],
    year: "2026",
    title: { en: "Logo-to-Print Pipeline", fr: "Chaîne logo → impression 3D" },
    subtitle: {
      en: "Turning a raster logo into printable badges, keyfobs and freestanding letters through an automated trace pipeline.",
      fr: "Transformer un logo matriciel en badges, porte-clés et lettres autoportantes imprimables via une chaîne de vectorisation automatisée."
    },
    images: ["iris-lockup.png", "iris-brand-hero.png", "dragon-yinyang.png"],
    tags: ["OpenSCAD", "OpenCV", "Python", "FDM", "Design for manufacture"],
    body: {
      en: [
        "A reusable pipeline that takes a raster logo, traces it with OpenCV into clean vector outlines, and emits parametric OpenSCAD geometry — producing badges, keyfobs and standalone dimensional letters from a single source image.",
        "The whole toolchain is written against a printing constraint set: parts must lie flat, print without supports, and fit a 300 mm cubed build volume. That constraint shapes the geometry upstream rather than being discovered at slicing time.",
        "Output was verified visually against the source artwork side by side before committing filament, and sliced with a reusable material profile.",
        "The same trace-to-solid pipeline has been reused for decorative work, including a two-piece symmetric wall panel where both halves are traced from a single source silhouette and interlock without fasteners."
      ],
      fr: [
        "Une chaîne réutilisable qui prend un logo matriciel, le vectorise avec OpenCV en contours propres et produit une géométrie paramétrique OpenSCAD — générant badges, porte-clés et lettres volumiques autoportantes à partir d'une seule image source.",
        "L'ensemble de l'outillage est écrit selon un jeu de contraintes d'impression : les pièces doivent reposer à plat, s'imprimer sans supports et tenir dans un volume de 300 mm de côté. Cette contrainte façonne la géométrie en amont au lieu d'être découverte au moment du tranchage.",
        "Le résultat a été vérifié visuellement côte à côte avec le visuel source avant d'engager du filament, puis tranché avec un profil matière réutilisable.",
        "La même chaîne vectorisation-vers-solide a été réutilisée pour des pièces décoratives, dont un panneau mural symétrique en deux parties dont les deux moitiés sont tracées à partir d'une seule silhouette source et s'emboîtent sans fixation."
      ]
    }
  },

  /* ==================================================================== 10 */
  {
    id: "mounts",
    featured: false,
    cats: ["mechanical"],
    year: "2026",
    title: { en: "Non-Destructive Display Mounts", fr: "Supports d'exposition non destructifs" },
    subtitle: {
      en: "A shelf bracket that needs no screws in the furniture, and a 296 mm lamp post that could not stand until it was redesigned.",
      fr: "Une équerre d'étagère sans aucune vis dans le meuble, et un lampadaire de 296 mm incapable de tenir debout avant refonte."
    },
    images: ["bracket-3d.png", "lamp-3d.png"],
    tags: ["OpenSCAD", "Structural design", "Centre of mass", "FDM"],
    body: {
      en: [
        "Two small mechanical problems with real constraints. The first is an over-the-edge shelf bracket: it had to carry a hanging display piece with <b>zero fasteners driven into the furniture</b>, so the load is taken entirely by clamping geometry over the shelf edge, and every part prints flat without supports.",
        "The second started from a purchased 3D asset for a 296 mm lamp post — which, when analysed, <b>literally could not stand up</b>: its centre of mass fell outside its base footprint. I split the model into nine support-free printable parts and designed a weighted plinth that brings the combined centre of mass back inside the support polygon.",
        "Both are reminders that a model looking correct on screen says nothing about whether the physical object is stable or manufacturable."
      ],
      fr: [
        "Deux petits problèmes mécaniques à contraintes réelles. Le premier est une équerre à cheval sur le bord d'une étagère : elle devait porter un élément décoratif suspendu <b>sans aucune vis dans le meuble</b>, l'effort est donc entièrement repris par une géométrie de serrage sur le chant de l'étagère, et chaque pièce s'imprime à plat sans supports.",
        "Le second part d'un modèle 3D acheté représentant un lampadaire de 296 mm — qui, après analyse, <b>ne pouvait littéralement pas tenir debout</b> : son centre de masse tombait en dehors de son embase. J'ai découpé le modèle en neuf pièces imprimables sans support et conçu un socle lesté qui ramène le centre de masse combiné à l'intérieur du polygone de sustentation.",
        "Les deux rappellent qu'un modèle correct à l'écran ne dit rien de la stabilité ni de la fabricabilité de l'objet physique."
      ]
    }
  },

  /* ==================================================================== 11 */
  {
    id: "power",
    featured: false,
    cats: ["electronics"],
    year: "2025",
    title: { en: "Power Electronics Design &amp; Simulation Suite", fr: "Ensemble de conception et simulation en électronique de puissance" },
    subtitle: {
      en: "AC power controllers, a 0–10 V industrial dimmer, a digital tachometer and a brushless drive, designed and simulated end to end.",
      fr: "Gradateurs, variateur industriel 0–10 V, tachymètre numérique et commande brushless, conçus et simulés de bout en bout."
    },
    images: [],
    tags: ["Proteus", "Power electronics", "Analog design", "Microcontroller", "PSIM"],
    body: {
      en: [
        "A body of power-electronics design work carried through schematic capture and full mixed-signal simulation before any board was built.",
        "It covers phase-angle AC power controllers (including a capacitive-trigger variant), a 0–10 V industrial power regulator matching the standard control-signal interface used on drives and dimmable ballasts, a microcontroller-based digital tachometer, and a brushless motor drive — alongside characterisation work on transistor stages and power amplifiers.",
        "Simulating first is the point: switching topologies punish the difference between a circuit that works on paper and one that survives a real inductive load."
      ],
      fr: [
        "Un ensemble de travaux d'électronique de puissance menés jusqu'à la saisie de schémas et la simulation mixte complète avant toute réalisation de carte.",
        "Il couvre des gradateurs à commande par angle de phase (dont une variante à déclenchement capacitif), un variateur de puissance industriel 0–10 V correspondant à l'interface de signal de commande standard des variateurs et ballasts gradables, un tachymètre numérique à microcontrôleur et une commande de moteur brushless — ainsi que des travaux de caractérisation d'étages à transistors et d'amplificateurs de puissance.",
        "Simuler d'abord est essentiel : les topologies à découpage sanctionnent durement l'écart entre un circuit juste sur le papier et un circuit qui survit à une vraie charge inductive."
      ]
    }
  },

  /* ==================================================================== 13 */
  {
    id: "pvsyst",
    featured: false,
    cats: ["electronics"],
    year: "2025",
    title: { en: "Photovoltaic System Design — Gabès", fr: "Conception d'un système photovoltaïque — Gabès" },
    subtitle: {
      en: "A solar PV installation sized and simulated in PVsyst against the real irradiation of a site in southern Tunisia.",
      fr: "Une installation solaire photovoltaïque dimensionnée et simulée sous PVsyst avec l'irradiation réelle d'un site du sud tunisien."
    },
    images: [],
    tags: ["PVsyst 7", "Solar PV", "Energy yield", "Simulation", "Meteo data"],
    body: {
      en: [
        "A full photovoltaic system study built in PVsyst 7 for a site in Gabès, Tunisia, using that location's own meteorological dataset rather than a generic climate. The design was carried through to a computed simulation run — array sizing, orientation and an energy-yield estimate — not left as an empty project file.",
        "Solar is a natural fit for the region and a deliberate complement to the rest of this portfolio: the same discipline of designing against measured conditions, applied to energy systems instead of robots. Sizing a PV array well means respecting the site's real irradiation, temperature and loss mechanisms — which is exactly what a proper simulation forces you to account for."
      ],
      fr: [
        "Une étude complète de système photovoltaïque réalisée sous PVsyst 7 pour un site à Gabès, en Tunisie, en s'appuyant sur le jeu de données météorologiques propre à ce lieu plutôt que sur un climat générique. La conception a été menée jusqu'à une simulation calculée — dimensionnement du champ, orientation et estimation du productible — et non laissée à l'état de projet vide.",
        "Le solaire est une évidence pour la région et un complément assumé au reste de ce portfolio : la même rigueur de conception face à des conditions mesurées, appliquée aux systèmes énergétiques plutôt qu'aux robots. Bien dimensionner un champ PV, c'est respecter l'irradiation, la température et les mécanismes de pertes réels du site — précisément ce qu'une simulation sérieuse oblige à prendre en compte."
      ]
    }
  },

  /* ==================================================================== 14 */
  {
    id: "mcu",
    featured: false,
    cats: ["embedded", "electronics"],
    year: "2025",
    title: { en: "Microcontroller &amp; Sensor Firmware Studies", fr: "Travaux de firmware microcontrôleur &amp; capteurs" },
    subtitle: {
      en: "A set of small but complete embedded programs — PIC instrumentation with LCD readout, and an NFC tag reader.",
      fr: "Un ensemble de programmes embarqués petits mais complets — instrumentation PIC avec affichage LCD, et un lecteur de badges NFC."
    },
    images: [],
    tags: ["PIC", "mikroC", "Arduino", "PN532 NFC", "HD44780 LCD", "ADC", "I2C"],
    body: {
      en: [
        "A collection of the smaller embedded programs that make up the everyday practice behind the larger builds — each one complete, compiled and doing a real job on real silicon.",
        "<b>PIC instrumentation (mikroC).</b> A digital tachometer that reads three analog channels through the ADC and drives a 16×2 HD44780 LCD in 4-bit mode; and a motor-speed program that computes RPM and voltage and switches a transistor output while displaying the reading. Both carry their full toolchain output — compiled hex, listing and assembly.",
        "<b>NFC reader.</b> An Arduino program driving a PN532 module over I2C to read passive MIFARE / ISO&nbsp;14443A tag UIDs and report them over serial — the access-control front end from an internship task.",
        "None of these is a headline project, but together they are the reason the headline projects work: the LCD, ADC, I2C and serial groundwork that a bigger robot quietly depends on."
      ],
      fr: [
        "Un ensemble des petits programmes embarqués qui constituent la pratique quotidienne derrière les réalisations plus importantes — chacun complet, compilé et remplissant une fonction réelle sur du vrai silicium.",
        "<b>Instrumentation PIC (mikroC).</b> Un tachymètre numérique qui lit trois voies analogiques via l'ADC et pilote un afficheur LCD 16×2 HD44780 en mode 4 bits ; et un programme de vitesse moteur qui calcule le régime (tr/min) et la tension, commute une sortie transistor et affiche la mesure. Les deux comportent la sortie complète de la chaîne d'outils — hex compilé, listing et assembleur.",
        "<b>Lecteur NFC.</b> Un programme Arduino pilotant un module PN532 en I2C pour lire les UID de badges passifs MIFARE / ISO&nbsp;14443A et les transmettre en série — la partie frontale de contrôle d'accès issue d'une tâche de stage.",
        "Aucun n'est un projet phare, mais ensemble ils sont la raison pour laquelle les projets phares fonctionnent : le socle LCD, ADC, I2C et liaison série dont un robot plus gros dépend discrètement."
      ]
    }
  },

  /* ==================================================================== 16 */
  {
    id: "bldc",
    featured: false,
    cats: ["electronics", "embedded"],
    year: "2025",
    title: { en: "Sensorless BLDC Motor Control (Back-EMF)", fr: "Commande sensorless de moteur BLDC (FCEM)" },
    subtitle: {
      en: "Spinning a brushless motor with no position sensor — commutating on the back-EMF zero crossings instead.",
      fr: "Faire tourner un moteur brushless sans capteur de position — en commutant sur les passages par zéro de la FCEM."
    },
    images: [],
    tags: ["BLDC", "Sensorless", "Back-EMF", "Arduino", "Proteus", "Motor control"],
    body: {
      en: [
        "A focused study of how to run a brushless-DC motor <b>without any Hall sensors</b>. Removing the position sensors makes the motor cheaper and more robust, but it also removes the thing the controller normally relies on to know when to commutate — so the rotor position has to be recovered from the motor itself.",
        "<b>The method is back-EMF zero-crossing detection.</b> At any instant one of the three windings is unenergised, and the voltage it generates — its back-EMF, measured against a virtual neutral point — crosses zero exactly between two commutation events. Detecting that crossing, waiting the right electrical angle, and stepping the PWM to the next phase keeps the motor in sync with no sensor at all.",
        "The work covers the electrical and mechanical model of the motor, the commutation and PWM logic, and a Proteus simulation alongside the Arduino implementation — the standard progression of proving the idea in simulation before trusting it to real windings, which is exactly where sensorless schemes tend to bite."
      ],
      fr: [
        "Une étude ciblée sur la manière de faire tourner un moteur brushless <b>sans aucun capteur à effet Hall</b>. Retirer les capteurs de position rend le moteur moins cher et plus robuste, mais supprime aussi ce sur quoi le variateur s'appuie normalement pour savoir quand commuter — la position du rotor doit donc être reconstituée à partir du moteur lui-même.",
        "<b>La méthode est la détection du passage par zéro de la FCEM.</b> À chaque instant, l'un des trois enroulements est non alimenté, et la tension qu'il génère — sa force contre-électromotrice, mesurée par rapport à un point neutre virtuel — passe par zéro exactement entre deux commutations. Détecter ce passage, attendre le bon angle électrique, puis avancer le PWM vers la phase suivante maintient le moteur synchrone sans aucun capteur.",
        "Le travail couvre le modèle électrique et mécanique du moteur, la logique de commutation et de PWM, ainsi qu'une simulation Proteus aux côtés de l'implémentation Arduino — la progression classique consistant à valider l'idée en simulation avant de la confier à de vrais enroulements, précisément là où les schémas sensorless piègent."
      ]
    }
  },

  /* ==================================================================== 17 */
  {
    id: "stockbot",
    featured: false,
    cats: ["robotics", "software"],
    year: "2026",
    title: { en: "STOCKBOT — Autonomous Inventory Robot (concept)", fr: "STOCKBOT — Robot d'inventaire autonome (concept)" },
    subtitle: {
      en: "A concept and business model for a warehouse robot that takes stock autonomously — the idea worked out before the hardware.",
      fr: "Un concept et un modèle économique pour un robot d'entrepôt qui réalise l'inventaire de façon autonome — l'idée mûrie avant le matériel."
    },
    images: [],
    tags: ["Concept", "Business Model Canvas", "Warehouse robotics", "Embedded AI", "Pitch"],
    body: {
      en: [
        "STOCKBOT is a concept for an autonomous inventory robot: a mobile platform that roams a warehouse and counts stock on its own, using embedded AI to keep a real-time, traceable picture of what is on the shelves — replacing the manual stock-take that ties up staff and is out of date the moment it finishes.",
        "This one is presented honestly as what it is: a worked-out concept and a <b>Business Model Canvas</b>, developed with the FIDEL Metouia association and ENIG, not a built machine. It is here because framing a robotics idea as a product — who it is for, what it costs, why it wins — is a different and useful muscle from building the robot, and it draws directly on the autonomy and perception work elsewhere in this portfolio."
      ],
      fr: [
        "STOCKBOT est un concept de robot d'inventaire autonome : une plateforme mobile qui parcourt un entrepôt et compte les stocks seule, en s'appuyant sur une IA embarquée pour maintenir une image en temps réel et traçable de ce qui se trouve en rayon — remplaçant l'inventaire manuel qui mobilise le personnel et est déjà périmé sitôt terminé.",
        "Celui-ci est présenté honnêtement pour ce qu'il est : un concept abouti et un <b>Business Model Canvas</b>, développés avec l'association FIDEL Metouia et l'ENIG, et non une machine construite. Il figure ici parce que formuler une idée robotique comme un produit — pour qui, à quel coût, pourquoi elle s'impose — est une compétence différente et utile de celle de construire le robot, et elle s'appuie directement sur les travaux d'autonomie et de perception présentés ailleurs dans ce portfolio."
      ]
    }
  }
];

/* -------------------------------------------------------------------------- */

const EXPERIENCE = [
  {
    period: { en: "2025 — present", fr: "2025 — aujourd'hui" },
    role: { en: "Engineering student — Electrical / Mechatronics", fr: "Élève ingénieur — Génie électrique / Mécatronique" },
    org: { en: "National Engineering School of Gabès (ENIG)", fr: "École Nationale d'Ingénieurs de Gabès (ENIG)" },
    detail: {
      en: "Coursework and personal projects across embedded control, power electronics, robotics and CAD. Most of the hardware on this page was designed and built alongside the programme.",
      fr: "Cursus et projets personnels en commande embarquée, électronique de puissance, robotique et CAO. La plupart du matériel présenté ici a été conçu et réalisé en parallèle de la formation."
    }
  },
  {
    period: { en: "2025 / 2026", fr: "2025 / 2026" },
    role: { en: "Technical company visits — report author", fr: "Visites techniques d'entreprises — auteur du rapport" },
    org: { en: "ENIG — SEA, LEONI, SOMEF & STEG (supervisor: M. Mehdi Dhaoui)", fr: "ENIG — SEA, LEONI, SOMEF & STEG (encadrant : M. Mehdi Dhaoui)" },
    detail: {
      en: "Co-authored a formal technical report on a series of industrial site visits, covering automation-system maintenance and a ROS robotics research lab at SEA, wiring-harness manufacturing at LEONI, and production and power operations at SOMEF and STEG. Written with Salim Omri.",
      fr: "Co-rédaction d'un rapport technique formel sur une série de visites de sites industriels, couvrant la maintenance des systèmes automatisés et un laboratoire de recherche en robotique ROS chez SEA, la fabrication de faisceaux chez LEONI, ainsi que la production et l'exploitation électrique chez SOMEF et STEG. Rédigé avec Salim Omri."
    }
  },
  {
    period: { en: "2023 — present", fr: "2023 — aujourd'hui" },
    role: { en: "Head of Robotics — Alliance of Engineers Club", fr: "Responsable Robotique — Club Alliance of Engineers" },
    org: { en: "ENIG · ENIGRobots 7.0 (Co-Chair) · BattleSky 1.0 & 2.0", fr: "ENIG · ENIGRobots 7.0 (co-président) · BattleSky 1.0 & 2.0" },
    detail: {
      en: "Led the robotics department of the Alliance of Engineers Club (promoted from Co-Head to Head). Co-Chaired ENIGRobots 7.0 — an international robotics event — and organised its 6th edition, and was on the organising team for both editions of BattleSky.",
      fr: "Direction du département robotique du club Alliance of Engineers (promu de co-responsable à responsable). Co-présidence d'ENIGRobots 7.0 — un évènement international de robotique — et organisation de sa 6e édition, ainsi que membre de l'équipe d'organisation des deux éditions de BattleSky."
    }
  },
  {
    period: { en: "2025 — Summer", fr: "2025 — Été" },
    role: { en: "Automation intern", fr: "Stagiaire automatisme" },
    org: { en: "STEG — Feriana (Tunisian Electricity & Gas Company)", fr: "STEG — Feriana (Société Tunisienne de l'Électricité et du Gaz)" },
    detail: {
      en: "Studied the industrial infrastructure of a gas-turbine power plant, analysing its automatic control and regulation systems and examining real-time control-command and regulation loops.",
      fr: "Étude de l'infrastructure industrielle d'une centrale à turbine à gaz, analyse de ses systèmes de contrôle et de régulation automatiques et examen des boucles de contrôle-commande et de régulation en temps réel."
    }
  }
];

const SKILLS = [
  {
    group: { en: "Robotics &amp; autonomy", fr: "Robotique &amp; autonomie" },
    items: ["ROS 2", "Isaac ROS", "Lidar / SLAM", "RGB-D perception", "Teleoperation", "PID control", "Odometry calibration"]
  },
  {
    group: { en: "Embedded systems", fr: "Systèmes embarqués" },
    items: ["STM32 (F446RE, F401, H723ZG)", "Arduino / AVR", "PIC / mikroC", "ESP32", "PlatformIO", "BLDC drives", "Custom PCB / Gerber", "Serial protocols", "NFC / RFID", "Sensor interfacing"]
  },
  {
    group: { en: "Software", fr: "Logiciel" },
    items: ["Python", "C / C++", "OpenCV", "NumPy", "GDScript / Godot", "Git", "Linux"]
  },
  {
    group: { en: "CAD &amp; manufacturing", fr: "CAO &amp; fabrication" },
    items: ["OpenSCAD (parametric)", "SolidWorks", "Blender", "FDM printing", "ideaMaker", "Design for manufacture", "Tolerance analysis"]
  },
  {
    group: { en: "Electronics", fr: "Électronique" },
    items: ["KiCad", "Proteus", "Power electronics", "Schematic capture", "Custom PCB / Gerber", "Instrumentation"]
  },
  {
    group: { en: "Simulation &amp; analysis", fr: "Simulation &amp; analyse" },
    items: ["MATLAB", "PSIM", "PVsyst", "Custom physics simulators"]
  }
];

const LANGUAGES = [
  { name: { en: "Arabic", fr: "Arabe" },   level: { en: "Native", fr: "Langue maternelle" } },
  { name: { en: "French", fr: "Français" }, level: { en: "Fluent", fr: "Courant" } },
  { name: { en: "English", fr: "Anglais" }, level: { en: "Professional working", fr: "Professionnel" } }
];

/* -------------------------------------------------------------------------- */

const UI = {
  navProjects:  { en: "Projects",   fr: "Projets" },
  navSkills:    { en: "Skills",     fr: "Compétences" },
  navExp:       { en: "Experience", fr: "Parcours" },
  navContact:   { en: "Contact",    fr: "Contact" },
  openTo:       { en: "Open to engineering internships", fr: "Ouvert aux stages d'ingénieur" },
  featured:     { en: "Selected work", fr: "Travaux sélectionnés" },
  allWork:      { en: "All projects",  fr: "Tous les projets" },
  readMore:     { en: "Read more",  fr: "En savoir plus" },
  readLess:     { en: "Close",      fr: "Fermer" },
  skillsTitle:  { en: "Skills &amp; tools", fr: "Compétences &amp; outils" },
  langTitle:    { en: "Languages",  fr: "Langues" },
  expTitle:     { en: "Education &amp; experience", fr: "Formation &amp; expérience" },
  contactTitle: { en: "Get in touch", fr: "Me contacter" },
  contactText:  {
    en: "Available for engineering internships and graduate roles in robotics, embedded systems and mechatronics.",
    fr: "Disponible pour des stages d'ingénieur et des postes junior en robotique, systèmes embarqués et mécatronique."
  },
  emailMe:      { en: "Email me", fr: "M'écrire" },
  footer:       { en: "Built and documented from the source repositories of each project.", fr: "Construit et documenté à partir des dépôts source de chaque projet." }
};
