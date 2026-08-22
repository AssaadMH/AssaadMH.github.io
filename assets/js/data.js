/* =============================================================================
   data.js — ALL portfolio content lives here.
   To edit the site you only ever need to touch this file.

   Every text is written as  { en: "...", fr: "..." }
   ========================================================================== */

const PROFILE = {
  // ---- EDIT THESE -----------------------------------------------------------
  name: "Lassaad Mahmoudi",
  initials: "LM",
  photo: "profile.jpg",           // hero portrait, assets/img/
  email: "contact@iris-systems.tn",
  phone: "+216 23 315 873",
  github: "https://github.com/AssaadMH",
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

  /* ====================================================================== 1 */
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
    images: ["shadow-vehicle.jpg", "shadow-ride.jpg", "shadow-power-bay.jpg", "shadow-pointcloud.jpg",
              "shadow-architecture.png", "shadow-perfboard.png", "shadow-schema.png", "shadow-power-domains.png"],
    fit: "cover",
    tags: ["ROS 2", "Jetson Orin Nano", "STM32 F446RE / F401", "Isaac ROS", "C", "Python", "BLDC", "Linux"],
    body: {
      en: [
        "A full-size four-wheel-drive robot built from scratch: an NVIDIA Jetson Orin Nano as the compute brain, an STM32 Nucleo as the real-time motor MCU, and four generic 48–64 V BLDC hub-motor controllers on a 52 V pack. Throttle and reverse work on all four wheels.",
        "<b>Motor control.</b> Each throttle line is filtered through a 1 kΩ + 10 µF RC network into the controller, and each reverse line is driven through a 2N2222 inverter. The controllers only latch reverse at a standstill, so the firmware implements an explicit stop → settle (1000 ms) → reverse-throttle sequence. A bench safety cap limits duty to 216/255 while the wheels are raised. Odometry was calibrated against tape measurements to 0.0090 m per pulse.",
        "<b>ROS 2 architecture.</b> I replaced an early monolithic gamepad bridge with a layered, hardware-verified stack: <code>motor_driver</code> (subscribes <code>cmd_vel</code>, <code>brake</code> and <code>cmd_raw</code>, holds a 0.5 s watchdog, talks serial to the STM32), <code>motor_teleop</code> (DualSense → <code>cmd_vel</code>), and <code>motor_bringup</code> (launch files and controller config). The old monolith was kept intact as a rollback path.",
        "<b>Perception.</b> A YDLidar X2 publishes scans through a ROS 2 driver with tuned parameters — the enable-motor gotcha turned out to be a serial DTR toggle. Two Xbox 360 Kinects supply RGB + depth over libfreenect plus a 4-microphone array via ALSA. On the Orin Nano, DetectNet, ESS stereo depth and U-Net from the Isaac ROS stack were deployed and verified.",
        "<b>Voice control.</b> Multilingual (FR / EN / AR) speech nodes map spoken commands directly to <code>cmd_vel</code>.",
        "<b>Localisation.</b> The Jetson runs Isaac ROS visual SLAM (cuVSLAM) inside a container built from a pinned configuration, so the perception brain is reproducible rather than a hand-tuned install that exists only on one board.",
        "<b>Developing without the robot.</b> The whole Jetson software layout is mirrored in a reproducible x86 virtual machine — same workspace structure, same container definition, same environment. It cannot run cuVSLAM, since there is no GPU and the architecture is wrong, and that is fine: what it does allow is versioning and testing launch files, the microcontroller bridge and sensor-fusion configuration without occupying, or risking, a robot with 52 V on board.",
        "<b>The engineering lesson.</b> An electrical hold-brake built by the team caught fire. The root cause was not an undersized part but a topology fault: the controller's thin \"antivol\" blue/yellow pair is a <i>motor phase</i>, not a signal line, carrying 52 V PWM and generator current. Any logic-ground-referenced MOSFET or optocoupler placed across it is a permanent half-wave short. The brake was a team effort throughout: the electrical version was the team’s work, and my own contribution was the mechanical replacement that followed — a design with zero electrical connection to the phases, which became another project on this page. Everything on this robot that touches pack voltage has since been designed failure-mode first."
      ],
      fr: [
        "Un robot 4×4 grandeur nature conçu de zéro : un NVIDIA Jetson Orin Nano comme cerveau de calcul, un STM32 Nucleo comme microcontrôleur moteur temps réel, et quatre variateurs BLDC 48–64 V pour moteurs-roues alimentés par un pack 52 V. Marche avant et marche arrière fonctionnent sur les quatre roues.",
        "<b>Commande moteur.</b> Chaque ligne d'accélération passe par un filtre RC 1 kΩ + 10 µF vers le variateur, et chaque ligne de marche arrière est pilotée via un inverseur 2N2222. Les variateurs ne verrouillent la marche arrière qu'à l'arrêt : le firmware applique donc une séquence explicite arrêt → stabilisation (1000 ms) → accélération inverse. Un plafond de sécurité limite le rapport cyclique à 216/255 tant que les roues sont levées. L'odométrie a été calibrée au mètre-ruban à 0,0090 m par impulsion.",
        "<b>Architecture ROS 2.</b> J'ai remplacé un pont manette monolithique par une pile en couches, validée sur matériel : <code>motor_driver</code> (souscrit à <code>cmd_vel</code>, <code>brake</code> et <code>cmd_raw</code>, chien de garde de 0,5 s, liaison série vers le STM32), <code>motor_teleop</code> (DualSense → <code>cmd_vel</code>) et <code>motor_bringup</code> (fichiers de lancement et configuration). L'ancien monolithe a été conservé comme solution de repli.",
        "<b>Perception.</b> Un YDLidar X2 publie ses scans via un driver ROS 2 paramétré — le piège d'activation du moteur s'est révélé être une bascule DTR sur le port série. Deux Kinect Xbox 360 fournissent RGB + profondeur via libfreenect ainsi qu'un réseau de 4 microphones via ALSA. Sur l'Orin Nano, DetectNet, la profondeur stéréo ESS et U-Net de la pile Isaac ROS ont été déployés et vérifiés.",
        "<b>Commande vocale.</b> Des nœuds multilingues (FR / EN / AR) traduisent directement la parole en <code>cmd_vel</code>.",
        "<b>Localisation.</b> Le Jetson exécute le SLAM visuel Isaac ROS (cuVSLAM) dans un conteneur construit à partir d'une configuration figée : le cerveau de perception est ainsi reproductible, et non une installation réglée à la main n'existant que sur une seule carte.",
        "<b>Développer sans le robot.</b> Toute l'organisation logicielle du Jetson est répliquée dans une machine virtuelle x86 reproductible — même structure de workspace, même définition de conteneur, même environnement. Elle ne peut pas exécuter cuVSLAM, faute de GPU et avec une architecture différente, et c'est très bien ainsi : ce qu'elle permet, c'est de versionner et de tester les fichiers de lancement, le pont vers le microcontrôleur et la configuration de fusion de capteurs sans occuper — ni risquer — un robot embarquant du 52 V.",
        "<b>La leçon d'ingénierie.</b> Un frein de maintien électrique construit par l'équipe a pris feu. La cause n'était pas un composant sous-dimensionné mais une faute de topologie : la paire fine bleu/jaune « antivol » du variateur est une <i>phase moteur</i>, pas une ligne de signal ; elle transporte du PWM 52 V et du courant de génératrice. Tout MOSFET ou optocoupleur référencé à la masse logique placé dessus constitue un court-circuit permanent en demi-alternance. J'ai rédigé le post-mortem complet et redirigé la conception vers un frein mécanique sans aucune liaison électrique avec les phases — ce qui est devenu un autre projet de cette page. Depuis, tout ce qui touche à la tension du pack sur ce robot est conçu en partant des modes de défaillance."
      ]
    }
  },

  /* ====================================================================== 2 */
  {
    id: "scooter",
    featured: false,
    cats: ["embedded", "robotics", "electronics"],
    year: "2025",
    title: { en: "Electric-Scooter Drive — Reverse Engineering", fr: "Motorisation de trottinette électrique — rétro-ingénierie" },
    subtitle: {
      en: "Taking control of a sealed motor controller by first finding out what its display bus actually carried — the origin of SHADOW's drivetrain.",
      fr: "Prendre le contrôle d'un variateur scellé en découvrant d'abord ce que transportait vraiment son bus d'afficheur — l'origine de la motorisation de SHADOW."
    },
    images: ["scooter-harness.jpg", "scooter-breakout.jpg", "scooter-controller.jpg"],
    tags: ["Arduino", "Bus sniffing", "Protocol decoding", "PWM + RC", "PI control", "Reverse engineering"],
    body: {
      en: [
        "Before SHADOW there was a scooter: a sealed commercial motor controller with no documented command interface, and the open question of whether a microcontroller could drive it at all.",
        "<b>Sniffing the bus.</b> I wired an Arduino onto the line between the controller and the handlebar display and captured the traffic. The frame is a fixed-length packet ending in an XOR checksum — readable once the checksum was worked out — carrying speed, battery state and faults.",
        "<b>The finding that redirected the project was a negative one:</b> that bus is <i>telemetry, not command</i>. Nothing sent on it makes a wheel turn. Establishing that saved all the effort that would have gone into forging command frames which do not exist, and moved the search to the dashboard connector instead.",
        "<b>The real control path is the analog throttle line.</b> Mapping the six-pin dashboard connector located it, and driving it with PWM through a 1 kΩ + 10 µF RC network turns a digital output into the smooth analog voltage the controller expects. With wheel speed decoded from the display bus as feedback, a PI loop closes the speed control — the telemetry bus turned out to be useful for exactly the half of the problem it was suited to.",
        "This is not archived history. SHADOW's four motor channels are driven exactly this way today; the 4WD documentation asserts that RC filter as a given, and this project is where it comes from."
      ],
      fr: [
        "Avant SHADOW, il y a eu une trottinette : un variateur commercial scellé sans aucune interface de commande documentée, et la question ouverte de savoir si un microcontrôleur pouvait le piloter.",
        "<b>Écoute du bus.</b> J'ai branché un Arduino sur la liaison entre le variateur et l'afficheur du guidon et capturé le trafic. La trame est un paquet de longueur fixe terminé par une somme de contrôle XOR — lisible une fois cette somme reconstituée — transportant vitesse, état de batterie et défauts.",
        "<b>La découverte qui a réorienté le projet est négative :</b> ce bus transporte de la <i>télémétrie, pas des commandes</i>. Rien de ce qu'on y envoie ne fait tourner une roue. L'établir a évité tout l'effort qui serait parti dans la fabrication de trames de commande inexistantes, et a déplacé la recherche vers le connecteur du tableau de bord.",
        "<b>Le vrai chemin de commande est la ligne analogique d'accélérateur.</b> La cartographie du connecteur six broches du tableau de bord l'a localisée, et la piloter en PWM à travers un filtre RC 1 kΩ + 10 µF transforme une sortie numérique en la tension analogique lisse attendue par le variateur. Avec la vitesse de roue décodée depuis le bus d'afficheur comme retour, une régulation PI ferme la boucle de vitesse — le bus de télémétrie s'est finalement révélé utile pour exactement la moitié du problème à laquelle il convenait.",
        "Ce n'est pas de l'histoire archivée. Les quatre voies moteur de SHADOW sont pilotées ainsi aujourd'hui ; la documentation du 4×4 présente ce filtre RC comme une donnée, et c'est ici qu'il prend sa source."
      ]
    }
  },

  /* ====================================================================== 3 */
  {
    id: "shield",
    featured: false,
    cats: ["electronics", "embedded", "robotics"],
    year: "2026",
    title: { en: "4WD Motor-Control Shield — Custom Nucleo-64 PCB", fr: "Shield de commande moteur 4×4 — carte Nucleo-64 sur mesure" },
    subtitle: {
      en: "The 24-signal interface board that replaces SHADOW's perfboard wiring — and the two pin conflicts that only appeared on re-checking the spec.",
      fr: "La carte d'interface 24 signaux qui remplace le câblage sur plaque perforée de SHADOW — et les deux conflits de brochage révélés par la relecture du cahier des charges."
    },
    images: ["shield-board-3d.jpg", "shield-groundplan.png"],
    tags: ["Proteus 8", "PCB design", "STM32 Nucleo-64", "Schematic capture", "DRC", "BOM"],
    body: {
      en: [
        "SHADOW's four motor controllers, steering bridge, encoder, brake servo and lights were all wired on perfboard. This is the board that replaces that harness: a Nucleo-64 shield carrying <b>24 signals</b> — four throttle and four reverse channels, six Hall inputs, a BTS7960 steering bridge, an AS5600 steering-angle encoder, the brake servo and five lighting channels — brought out on pluggable screw terminals so the loom can be disconnected without desoldering anything.",
        "<b>Deliberate decisions, not defaults.</b> Every lighting channel is kept at 12 V so that pack voltage never appears anywhere on this board. The star ground is a real 0 Ω link rather than a net tie, because the chosen tool has no net-tie object and the simulator needs a single 0 V reference to converge. Only the two 2×19 Morpho headers are populated: all 24 signals are available there, and skipping the Arduino headers also sidesteps an ambiguous solder-bridge mapping in which one analog pin can land on a signal already in use.",
        "<b>What re-checking the spec found.</b> The source wiring document stated there were no pin conflicts. Two survived that claim. The on-board user button shares an external-interrupt line with one of the Hall inputs, so the button has to be polled rather than interrupt-driven or it will fight the odometry. And one output sat on a timer already running at kilohertz for a throttle channel, forcing a move to a different alternate function. Neither would have announced itself — both would have shown up as intermittent misbehaviour after assembly.",
        "<b>One circuit is missing on purpose.</b> The source document specifies an optocoupler across what it labels an anti-theft line. That pair is a motor phase, and driving it is what caused the earlier fire on this robot. It is left off the board deliberately, and the omission is written down as a decision — so that a later reader restores nothing as an apparent oversight.",
        "<b>Footprint verification without the vendor.</b> The manufacturer's site was unreachable, so the connector geometry was taken from two independent published sources that agree with each other, cross-checked against the board's own width by symmetry, and is to be confirmed with a 1:1 paper print before any order. Coordinates prove mechanics, not orientation — pin 1 still gets checked against the silkscreen."
      ],
      fr: [
        "Les quatre variateurs, le pont de direction, le codeur, le servomoteur de frein et l'éclairage de SHADOW étaient tous câblés sur plaque perforée. Voici la carte qui remplace ce faisceau : un shield Nucleo-64 portant <b>24 signaux</b> — quatre voies d'accélérateur et quatre de marche arrière, six entrées Hall, un pont de direction BTS7960, un codeur d'angle AS5600, le servomoteur de frein et cinq voies d'éclairage — sortis sur borniers à vis débrochables, afin de pouvoir déconnecter le faisceau sans rien dessouder.",
        "<b>Des choix assumés, pas des valeurs par défaut.</b> Chaque voie d'éclairage reste en 12 V pour que la tension du pack n'apparaisse nulle part sur cette carte. La masse en étoile est un véritable strap 0 Ω plutôt qu'un net tie, car l'outil retenu n'offre pas d'objet net tie et le simulateur exige une référence 0 V unique pour converger. Seuls les deux connecteurs Morpho 2×19 sont implantés : les 24 signaux y sont tous disponibles, et se passer des connecteurs Arduino évite en outre une correspondance ambiguë de ponts de soudure où une broche analogique peut atterrir sur un signal déjà utilisé.",
        "<b>Ce que la relecture du cahier des charges a révélé.</b> Le document de câblage source affirmait l'absence de tout conflit de brochage. Deux ont survécu à cette affirmation. Le bouton utilisateur de la carte partage une ligne d'interruption externe avec l'une des entrées Hall : il doit donc être scruté par polling et non par interruption, sous peine de perturber l'odométrie. Et une sortie se trouvait sur un timer déjà cadencé à plusieurs kilohertz pour une voie d'accélérateur, imposant le passage à une autre fonction alternative. Aucun des deux ne se serait signalé — tous deux se seraient manifestés en dysfonctionnements intermittents après assemblage.",
        "<b>Un circuit est absent volontairement.</b> Le document source prévoit un optocoupleur sur ce qu'il désigne comme une ligne antivol. Cette paire est une phase moteur, et la piloter est ce qui a provoqué l'incendie survenu plus tôt sur ce robot. Elle est délibérément écartée de la carte, et cette omission est consignée comme une décision — afin qu'un lecteur ultérieur ne rétablisse rien en croyant corriger un oubli.",
        "<b>Vérifier une empreinte sans le fabricant.</b> Le site du constructeur étant inaccessible, la géométrie du connecteur a été reprise de deux sources publiées indépendantes concordantes, recoupée par symétrie avec la largeur de la carte elle-même, et reste à confirmer par une impression papier à l'échelle 1:1 avant toute commande. Des coordonnées prouvent la mécanique, pas l'orientation — la broche 1 se vérifie encore sur la sérigraphie."
      ]
    }
  },

  /* ====================================================================== 4 */
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
    images: ["brake-drum.png", "brake-printed.jpg", "brake-horn.png", "brake-generations.png", "brake-chain.png"],
    tags: ["OpenSCAD", "Mechanism design", "FDM", "Force analysis"],
    body: {
      en: [
        "After the electrical hold-brake failure on SHADOW, the parking brake had to become purely mechanical. SHADOW was a team project and the failed electrical brake was the team’s work; the mechanical replacement described here is my contribution to it. The first working actuator uses a TD-8130MG servo to pull two bicycle brake cables simultaneously through a printed cable drum.",
        "<b>The key design decision</b> is that the drum <i>captures the servo's stock metal horn</i> rather than reproducing its 25-tooth spline. A 25T spline printed in PLA strips under load — 30 kg·cm across 0.3 mm teeth on a 6 mm shaft is on the order of 100 kg of shear along the layer lines. A captured horn puts the torque into steel and reduces the plastic's job to holding it in place.",
        "<b>Force analysis drove the geometry, and it has exactly one governing variable.</b> At a fixed sweep angle the drum diameter follows directly from the cable stroke, and the pull follows inversely from the diameter — so <i>stroke sets force, and nothing else does</i>. That makes the honest way to gain force counter-intuitive: shrink the drum. The current design uses a 44 mm stroke on a Ø30.8 drum for about 6.4 kg per cable in normal working conditions, roughly 10.7 kg at stall. An earlier, larger revision with a longer stroke was weaker for the same servo. Going smaller still is not free either — below about Ø28 the cable groove undercuts the very shoulder the cable nipple pulls against, leaving under a millimetre of plastic to carry the load.",
        "<b>Both cable anchors sit 180° apart and wind the same way,</b> so the two pulls cancel as a couple instead of summing into a side load on the servo's output bearing. Cable housing stops and mounting blocks were designed alongside the drum — the pull is taken by a tongue bearing against a groove wall rather than by the clamp bolt — and laid out on a single print plate with a fit-test coupon beside the real part, so one print answers both questions.",
        "<b>The slicer caught what the CAD did not.</b> Square cable grooves left the flange above them hanging as an unsupported ring, so they became 90° V-sheaves that self-support — and, as a bonus, seat the cable at exactly the design radius automatically. A second finding is worth keeping: the CAD kernel reported the solid as clean while the exported mesh carried ten non-manifold edges, because a derived dimension landed exactly on another feature's rim. <b>A kernel saying \"simple: yes\" does not mean the exported file is sound</b> — the STL itself has to be checked, which is why every part here goes through an STL sanity script and a G-code verification pass before it reaches the printer.",
        "<b>The final drum is not servo-driven at all.</b> The servo version above proved the cable-pull principle, but the production part replaces the white worm wheel inside a Bosch window-lift motor (<code>0130821xxx</code>) with a printed wheel that carries the four-cable brake drum on the same hub — so the gearmotor’s own reduction does the pulling. The tooth count was recovered from photographs by unwrapping the rim into polar coordinates and taking a DFT of the tooth frequency: an unambiguous peak at 72. The live part, <code>gear60_v3</code>, runs 76 teeth on a 60.80&nbsp;mm pitch diameter (62.40&nbsp;mm across the tips), 2.00&nbsp;mm tooth height and an 8&nbsp;mm bore, on a split clamping hub with an M3 pinch bolt.",
        "<b>One number decides whether it fits, and it is still open.</b> Centre distance follows the <i>pitch</i> circle alone, so growing the wheel to 60.80&nbsp;mm moves the worm 1.60&nbsp;mm further out — 33.00&nbsp;mm stock becomes 34.60&nbsp;mm. Shaving the tooth tips buys none of it back: an earlier revision truncated the addendum and the centre distance did not move at all. Against a 2.00&nbsp;mm tooth height, 1.60&nbsp;mm of interference is a jam rather than a tight mesh, so this wheel needs a deliberate housing modification and will not drop into a stock gearbox. That is a known, quantified constraint of the current design rather than a surprise waiting at assembly."
      ],
      fr: [
        "Après la défaillance du frein de maintien électrique de SHADOW, le frein de stationnement devait devenir purement mécanique. Cet actionneur utilise un servo TD-8130MG pour tirer simultanément deux câbles de frein de vélo via un tambour imprimé.",
        "<b>La décision de conception clé</b> est que le tambour <i>capture le palonnier métallique d'origine du servo</i> au lieu de reproduire ses cannelures à 25 dents. Une cannelure 25T imprimée en PLA s'arrache sous charge — 30 kg·cm répartis sur des dents de 0,3 mm autour d'un arbre de 6 mm représentent de l'ordre de 100 kg de cisaillement dans le sens des couches. En capturant le palonnier, le couple passe par l'acier et le plastique n'a plus qu'à le maintenir en place.",
        "<b>L'analyse des efforts a dicté la géométrie, et elle ne compte qu'une seule variable directrice.</b> À angle de balayage fixe, le diamètre du tambour découle directement de la course du câble, et l'effort varie à l'inverse du diamètre — donc <i>la course fixe l'effort, et rien d'autre</i>. La façon honnête de gagner en effort en devient contre-intuitive : réduire le tambour. La conception actuelle utilise une course de 44 mm sur un tambour Ø30,8, soit environ 6,4 kg par câble en fonctionnement normal et près de 10,7 kg au blocage. Une révision antérieure, plus grande et à course plus longue, était plus faible pour le même servomoteur. Descendre encore n'est pas gratuit pour autant : en dessous d'environ Ø28, la gorge de câble vient miner l'épaulement même sur lequel s'appuie l'embout du câble, ne laissant pas un millimètre de plastique pour reprendre la charge.",
        "<b>Les deux ancrages de câble sont à 180° et s'enroulent dans le même sens,</b> de sorte que les deux efforts s'annulent en couple au lieu de s'additionner en charge latérale sur le palier de sortie du servomoteur. Les butées de gaine et les blocs de fixation ont été conçus avec le tambour — l'effort est repris par une languette en appui sur la paroi d'une gorge, et non par le boulon de serrage — puis disposés sur une seule plaque d'impression avec une éprouvette d'ajustement à côté de la pièce réelle, si bien qu'une seule impression répond aux deux questions.",
        "<b>Le trancheur a détecté ce que la CAO ignorait.</b> Des gorges de câble carrées laissaient la collerette au-dessus d'elles suspendue en anneau non soutenu : elles sont devenues des gorges en V à 90°, autoportantes — et qui, en prime, placent automatiquement le câble au rayon exact de conception. Un second enseignement mérite d'être retenu : le noyau CAO annonçait le solide comme sain alors que le maillage exporté portait dix arêtes non-manifold, parce qu'une dimension dérivée tombait exactement sur le bord d'une autre forme. <b>Un noyau qui répond « simple : oui » ne garantit pas un fichier exporté sain</b> — c'est le STL lui-même qu'il faut contrôler, raison pour laquelle chaque pièce passe ici par un script de vérification STL et une passe de vérification du G-code avant d'atteindre l'imprimante.",
        "<b>Le tambour final n’est pas entraîné par servomoteur.</b> La version à servomoteur ci-dessus a validé le principe de traction par câble, mais la pièce définitive remplace la roue à vis blanche d’un moteur de lève-vitre Bosch (<code>0130821xxx</code>) par une roue imprimée portant le tambour quatre câbles sur le même moyeu — la réduction du motoréducteur assure alors la traction. Le nombre de dents a été retrouvé à partir de photographies en déroulant la jante en coordonnées polaires puis en prenant la DFT de la fréquence des dents : un pic sans ambiguïté à 72. La pièce vive, <code>gear60_v3</code>, compte 76 dents sur un diamètre primitif de 60,80&nbsp;mm (62,40&nbsp;mm en tête), une hauteur de dent de 2,00&nbsp;mm et un alésage de 8&nbsp;mm, sur un moyeu à serrage fendu avec vis M3.",
        "<b>Un seul chiffre décide de la compatibilité, et il reste ouvert.</b> L’entraxe ne dépend que du cercle <i>primitif</i> : porter la roue à 60,80&nbsp;mm éloigne la vis de 1,60&nbsp;mm, l’entraxe passant de 33,00 à 34,60&nbsp;mm. Raboter la tête des dents n’en récupère rien : une révision antérieure a tronqué la saillie sans déplacer l’entraxe. Face à une hauteur de dent de 2,00&nbsp;mm, 1,60&nbsp;mm d’interférence constitue un blocage et non un engrènement serré : cette roue exige donc une modification délibérée du carter et ne se monte pas dans une boîte d’origine. C’est une contrainte connue et chiffrée de la conception actuelle, pas une mauvaise surprise à l’assemblage."
      ]
    }
  },

  /* ====================================================================== 5 */
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

  /* ====================================================================== 6 */
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
    images: ["linefollower-robot.jpg", "linefollower-plan.svg", "linefollower-path.svg"],
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

  /* ====================================================================== 7 */
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
    images: ["agv-robot.jpg", "agv-topdown.jpg", "agv-diagnostics.jpg", "agv-app.jpg", "agv-diagnosis.svg"],
    fit: "cover",
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

  /* ====================================================================== 8 */
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
    images: ["alliance-array.svg"],
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

  /* ====================================================================== 9 */
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
    images: ["kuka-cell.svg"],
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

  /* ===================================================================== 10 */
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
    images: ["face-live.jpg", "face-pipeline.svg"],
    fit: "cover",
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

  /* ===================================================================== 11 */
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
    images: ["power-board-3d.jpg"],
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

  /* ===================================================================== 12 */
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
    images: ["pvsyst-chain.svg"],
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

  /* ===================================================================== 13 */
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
    images: ["mcu-board-3d.jpg"],
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

  /* ===================================================================== 14 */
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
    images: ["bldc-board-3d.jpg"],
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

  /* ===================================================================== 15 */
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
    images: ["stockbot-concept.svg"],
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
,

  /* ==================== hobby — kept last ==================== */
  {
    id: "unknown",
    featured: false,
    cats: ["software"],
    year: "2026",
    title: { en: "UNKNOWN — Hobby Game Project", fr: "UNKNOWN — projet de jeu personnel" },
    subtitle: {
      en: "A side project built in my own time. It is here for one reason: what it taught me about measuring instead of assuming.",
      fr: "Un projet personnel mené sur mon temps libre. Il figure ici pour une seule raison : ce qu’il m’a appris sur la mesure plutôt que la supposition."
    },
    images: ["unknown3d-village.png"],
    fit: "cover",
    tags: ["Godot", "GDScript", "Profiling", "Hobby project"],
    body: {
      en: [
        "A hobby project, made in my own time with the Godot engine on an integrated GPU with roughly half a gigabyte of usable video memory. It is not engineering work and it is not offered as such — but working to that budget turned it into a performance exercise.",
        "<b>It taught me to measure instead of assuming.</b> The scene ran at 3.8 fps and I blamed the scenery; the real cost was a single directional-shadow pass taking roughly 70 % of the frame. Worse, three of the four test harnesses I had written were quietly reporting plausible but wrong numbers. Two rules came out of it, and I apply both to hardware now: to trust a measurement, change a known-good input and confirm the number moves — and to trust a visual claim, look at the pixels."
      ],
      fr: [
        "Un projet personnel, réalisé sur mon temps libre avec le moteur Godot, sur un GPU intégré disposant d’environ un demi-gigaoctet de mémoire vidéo utilisable. Ce n’est pas un travail d’ingénierie et il n’est pas présenté comme tel — mais travailler sous cette contrainte en a fait un exercice de performance.",
        "<b>Il m’a appris à mesurer plutôt qu’à supposer.</b> La scène tournait à 3,8 images/s et j’accusais le décor ; le coût réel était une seule passe d’ombres directionnelles occupant environ 70 % de la trame. Pire, trois des quatre bancs de test que j’avais écrits rapportaient discrètement des chiffres plausibles mais faux. Deux règles en découlent, que j’applique désormais au matériel : pour se fier à une mesure, modifier une entrée connue et vérifier que le chiffre bouge — et pour se fier à une affirmation visuelle, regarder les pixels."
      ]
    }
  }

];

/* -------------------------------------------------------------------------- */

const EXPERIENCE = [
  {
    period: { en: "2026 — Summer (10 weeks)", fr: "2026 — Été (10 semaines)" },
    role: {
      en: "Engineering intern — Robotics &amp; embedded systems",
      fr: "Stagiaire ingénieur — Robotique &amp; systèmes embarqués"
    },
    org: {
      en: "IRIS Systems — SHADOW autonomous vehicle programme",
      fr: "IRIS Systems — programme du véhicule autonome SHADOW"
    },
    detail: {
      en: "Ten-week engineering internship on SHADOW, a 52 V four-wheel-drive autonomous ground vehicle. At the start it was a test bench: four drive chains that worked but were commanded separately, perception hardware installed but not integrated, and no vehicle-level safety function at all. The mission ran on four axes — coordinated control of the four traction motors including reverse, a parking brake and badge-based start authorisation, commissioning the on-board perception chain, and a KiCad interface board to replace the bench's flying wiring. A fire on the test bench on 14 July 2026 forced a failure analysis that redirected part of the work: the electrical hold-brake was abandoned for a purely mechanical one. Documented in a 66-page engineering report.",
      fr: "Stage d'ingénieur de dix semaines sur SHADOW, un véhicule terrestre autonome à quatre roues motrices alimenté sous 52 V. Au départ, le véhicule était à l'état de banc d'essai : quatre chaînes de traction fonctionnelles mais commandées séparément, une informatique de perception installée mais non intégrée, et aucune fonction de sécurité au niveau du véhicule. La mission a porté sur quatre axes — la commande coordonnée des quatre moteurs de traction y compris en marche arrière, un frein de parc et une autorisation de mise en route par badge, la mise en service de la chaîne de perception embarquée, et une carte d'interface sous KiCad destinée à remplacer le câblage volant du banc. Un incendie survenu sur le banc le 14 juillet 2026 a imposé une analyse de défaillance qui a réorienté une partie du travail : le frein électrique a été abandonné au profit d'une solution purement mécanique. Le tout est documenté dans un rapport d'ingénieur de 66 pages."
    }
  },
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
    items: ["ROS 2 Humble", "Isaac ROS", "Visual SLAM (cuVSLAM)", "Jetson Orin Nano", "Lidar / SLAM", "RGB-D perception", "Teleoperation", "PID control", "Odometry calibration"]
  },
  {
    group: { en: "Embedded systems", fr: "Systèmes embarqués" },
    items: ["STM32 (F446RE, F401, H723ZG)", "Arduino / AVR", "PIC / mikroC", "ESP32", "PlatformIO", "BLDC drives", "Custom PCB / Gerber", "Serial protocols", "NFC / RFID", "Sensor interfacing"]
  },
  {
    group: { en: "Software", fr: "Logiciel" },
    items: ["Python", "C / C++", "OpenCV", "NumPy", "GDScript / Godot", "Git", "Linux", "Docker"]
  },
  {
    group: { en: "CAD &amp; manufacturing", fr: "CAO &amp; fabrication" },
    items: ["OpenSCAD (parametric)", "SolidWorks", "Blender", "FDM printing", "ideaMaker", "Design for manufacture", "Tolerance analysis", "ANSYS (beginner)"]
  },
  {
    group: { en: "Electronics", fr: "Électronique" },
    items: ["KiCad", "Proteus", "Power electronics", "Schematic capture", "Custom PCB / Gerber", "MOSFET gate drive", "DC load switching", "Fusing &amp; protection", "Instrumentation"]
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
