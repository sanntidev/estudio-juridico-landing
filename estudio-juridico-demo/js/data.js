/**
 * Vega & Asociados — Estudio Jurídico — Catálogo Centralizado de Datos y Configuración
 *
 * Plantilla demo para portfolio.
 * Los números de WhatsApp están configurados con un valor de demostración (`5493850000000`).
 */

window.VEGA_ASOCIADOS_DATA = {
  FIRM_CONFIG: {
    name: 'Vega & Asociados — Estudio Jurídico',
    city: 'Santiago del Estero, Argentina',
    addressShort: 'Av. Belgrano 450, Piso 2',
    building: 'Sede Centro',
    fullAddress: 'Av. Belgrano 450, Piso 2 · Santiago del Estero (G4200)',
    hours: 'Lun a Vie 8:30 a 20:30 hs',
    googleRating: '4.9/5',
    googleReviewsCount: '56+ opiniones verificadas',
    googleReviewsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Belgrano+450+Santiago+del+Estero+Argentina',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Av.%20Belgrano%20450%2C%20Santiago%20del%20Estero%2C%20Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed',
    email: 'consultas@vegaasociados-demo.com.ar',
    socials: {
      instagram: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/',
      facebook: 'https://www.facebook.com/'
    }
  },

  PARTNERS: [
    {
      id: 'vega',
      shortName: 'Dr. Martín Vega',
      fullName: 'Dr. Martín Vega',
      initials: 'MV',
      role: 'Abogado · Escribano · Mandatario del Automotor',
      badge: 'Socio Director',
      whatsapp: '5493850000000',
      phoneDisplay: '+54 9 385 000-0000',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
      photoAlt: 'Dr. Martín Vega, Abogado, Escribano y Mandatario del Automotor en Santiago del Estero - Vega & Asociados — Estudio Jurídico',
      bio: 'Especialista en derecho inmobiliario, sucesiones, operaciones registrales del automotor y negociación patrimonial. Combina formación jurídica y notarial para brindar seguridad preventiva y acuerdos ágiles sin dilaciones judiciales.',
      highlights: [
        'Abogado & Escribano',
        'Mandatario Nacional del Automotor',
        'Sucesiones, Tierras y Contratos'
      ]
    },
    {
      id: 'mendez',
      shortName: 'Dr. Lucas Méndez',
      fullName: 'Dr. Lucas Méndez',
      initials: 'LM',
      role: 'Abogado Especialista',
      badge: 'Socio Director',
      whatsapp: '5493850000000',
      phoneDisplay: '+54 9 385 000-0000',
      photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80',
      photoAlt: 'Dr. Lucas Méndez, Abogado Especialista en Accidentes Laborales, ART y Daños en Santiago del Estero - Vega & Asociados — Estudio Jurídico',
      bio: 'Enfocado en accidentes laborales y ART, reclamos de daños y tránsito, defensa del consumidor y litigios complejos. Estratega en mediación prejudicial y negociación directa con aseguradoras para obtener resarcimientos rápidos y justos.',
      highlights: [
        'Accidentes Laborales y ART',
        'Daños, Tránsito y Seguros',
        'Negociación y Defensa del Consumidor'
      ]
    }
  ],

  MODALITIES: [
    {
      id: 'presencial',
      title: 'Presencial en Estudio',
      subtitle: 'Av. Belgrano 450, Piso 2 · Santiago del Estero',
      whatsappLabel: 'Presencial en Estudio (Av. Belgrano 450, Piso 2 · Santiago del Estero)'
    },
    {
      id: 'virtual',
      title: 'Atención Virtual',
      subtitle: 'Videollamada / WhatsApp en toda la provincia de Santiago del Estero',
      whatsappLabel: 'Virtual (Atención remota en la provincia de Santiago del Estero)'
    }
  ],

  MAIN_PRACTICE_AREAS: [
    {
      id: 'laboral-art',
      title: 'Accidentes Laborales y ART',
      shortTag: 'Riesgos del Trabajo',
      recommendedPartner: 'mendez',
      summary: 'Reclamos por accidentes de trabajo, in itinere y enfermedades profesionales. Gestión ágil ante Comisiones Médicas y negociación de indemnizaciones integrales.',
      approach: 'Resolución rápida por vía administrativa y acuerdo homologado antes de llegar a un juicio de años.',
      icon: 'briefcase',
      cases: [
        'Accidentes en el lugar de trabajo o trayecto (in itinere)',
        'Determinación de incapacidad ante Comisiones Médicas (SRT)',
        'Enfermedades profesionales y rechazo de cobertura de ART',
        'Diferencias indemnizatorias y despidos vinculados a salud'
      ]
    },
    {
      id: 'danos-transito',
      title: 'Daños y Tránsito',
      shortTag: 'Siniestros Viales',
      recommendedPartner: 'mendez',
      summary: 'Reclamos extrajudiciales directos ante compañías aseguradoras por choques, lesiones, destrucción total, privación de uso y daño moral.',
      approach: 'Liquidación técnica de daños y negociación firme con aseguradoras para cobrar en semanas, no en años.',
      icon: 'car',
      cases: [
        'Colisiones vehiculares, motos y peatones en vía pública',
        'Reclamo directo ante aseguradoras de terceros',
        'Incapacidad sobreviniente, gastos médicos y lucro cesante',
        'Destrucción total, desvalorización del rodado y daño moral'
      ]
    },
    {
      id: 'inmobiliario-sucesiones',
      title: 'Inmobiliario y Sucesiones',
      shortTag: 'Patrimonio y Bienes',
      recommendedPartner: 'vega',
      summary: 'Tramitación ágil de declaratorias de herederos, particiones consensuadas, tracto abreviado, boletos de compraventa, alquileres y regularización de títulos.',
      approach: 'Acuerdos sucesorios ordenados y asesoramiento integral jurídico-notarial para proteger tu patrimonio.',
      icon: 'building',
      cases: [
        'Sucesiones ab intestato y testamentarias con acuerdo entre herederos',
        'Venta de inmuebles o automotores por tracto abreviado',
        'Redacción y revisión de boletos de compraventa y locaciones',
        'Desalojos, usucapión y saneamiento de títulos inmobiliarios'
      ]
    },
    {
      id: 'consumidor-comercial',
      title: 'Defensa del Consumidor y Comercial',
      shortTag: 'Consumo y Empresas',
      recommendedPartner: 'mendez',
      summary: 'Protección frente a bancos, billeteras virtuales, planes de ahorro, concesionarias, cláusulas abusivas e incumplimientos comerciales.',
      approach: 'Mediaciones de consumo estratégicas para lograr restitución de fondos, anulación de cargos o resarcimiento inmediato.',
      icon: 'shield',
      cases: [
        'Estafas bancarias, débitos indebidos y fraudes digitales',
        'Planes de ahorro automotor y demoras en entrega de unidades',
        'Incumplimientos contractuales de comercios y empresas de servicios',
        'Asesoramiento comercial, cobro de facturas y prevención de conflictos'
      ]
    }
  ],

  ADDITIONAL_SPECIALTIES: [
    {
      id: 'tierras',
      title: 'Tierras',
      description: 'Regularización dominial, posesión veinteañal (usucapión), conflictos posesorios y defensa de derechos sobre inmuebles rurales y urbanos.',
      recommendedPartner: 'vega'
    },
    {
      id: 'cobranzas',
      title: 'Cobranzas',
      description: 'Recupero extrajudicial efectivo de créditos, pagarés, cheques rechazados, expensas y deudas comerciales mediante intimación y acuerdos de pago.',
      recommendedPartner: 'mendez'
    },
    {
      id: 'contratos',
      title: 'Contratos',
      description: 'Redacción, auditoría y negociación de contratos civiles, comerciales, locaciones, fideicomisos y acuerdos societarios a medida.',
      recommendedPartner: 'vega'
    },
    {
      id: 'seguros',
      title: 'Seguros',
      description: 'Reclamos por incumplimiento de pólizas, rechazos injustificados de cobertura, robo de vehículos, seguros de vida y responsabilidad civil.',
      recommendedPartner: 'mendez'
    },
    {
      id: 'mediacion',
      title: 'Mediación',
      description: 'Representación estratégica en instancias de mediación prejudicial y privada para cerrar acuerdos vinculantes en tiempo récord.',
      recommendedPartner: 'mendez'
    },
    {
      id: 'litigios',
      title: 'Litigios',
      description: 'Patrocinio letrado sólido en procesos civiles, comerciales y laborales cuando la vía judicial resulta indispensable para resguardar tus derechos.',
      recommendedPartner: 'mendez'
    },
    {
      id: 'ejecuciones',
      title: 'Ejecuciones',
      description: 'Juicios ejecutivos rápidos sobre títulos de crédito, alquileres impagos, garantías y ejecución de sentencias o convenios incumplidos.',
      recommendedPartner: 'mendez'
    },
    {
      id: 'peritos',
      title: 'Peritos',
      description: 'Articulación con peritos médicos, accidentológicos, contables e ingenieros para respaldar cuantificaciones de daños y acuerdos.',
      recommendedPartner: 'mendez'
    },
    {
      id: 'expropiaciones',
      title: 'Expropiaciones',
      description: 'Defensa del justo valor indemnizatorio ante expropiaciones públicas, servidumbres administrativas y afectaciones de propiedad.',
      recommendedPartner: 'vega'
    },
    {
      id: 'automotor-registral',
      title: 'Derecho Automotor y Registral',
      description: 'Gestión integral como Mandatario del Automotor: transferencias complejas, prendas, embargos, sucesiones de rodados y denuncias de venta.',
      recommendedPartner: 'vega'
    },
    {
      id: 'notarial-escrituracion',
      title: 'Asesoramiento Notarial y Escrituración',
      description: 'Estructuración preventiva de operaciones inmobiliarias, poderes, actas de constatación y acompañamiento integral hasta la escritura.',
      recommendedPartner: 'vega'
    }
  ],

  GOOGLE_REVIEWS: [
    {
      author: 'Federico Navarro',
      rating: 5,
      date: 'Hace 3 semanas',
      tag: 'Accidente de Tránsito',
      text: 'Excelente atención del Dr. Méndez. Me chocaron y la aseguradora no me respondía; lograron cerrar un acuerdo muy bueno por mediación en menos de dos meses, sin tener que ir a juicio.'
    },
    {
      author: 'Sofía Ferreyra',
      rating: 5,
      date: 'Hace 1 mes',
      tag: 'Sucesión e Inmuebles',
      text: 'Consultamos con el Dr. Martín Vega por la sucesión de mi padre y la venta de una propiedad. Fueron súper claros desde el primer día, todo transparente y muy ordenado en sus oficinas del centro.'
    },
    {
      author: 'Gustavo Roldán',
      rating: 5,
      date: 'Hace 2 meses',
      tag: 'Accidente Laboral y ART',
      text: 'Tuve un accidente en mi trabajo y la ART me quería dar el alta sin reconocer la lesión. Me acompañaron en toda la instancia médica y conseguimos la indemnización que correspondía.'
    },
    {
      author: 'Mariana Quiroga',
      rating: 5,
      date: 'Hace 2 meses',
      tag: 'Defensa del Consumidor',
      text: 'Hice consulta virtual desde el interior por un problema grave con un plan de ahorro. En pocas semanas se presentó el reclamo y resolvimos todo sin necesidad de viajar a Capital.'
    },
    {
      author: 'Alejandro Pereyra',
      rating: 5,
      date: 'Hace 3 meses',
      tag: 'Contratos y Automotor',
      text: 'Muy profesionales. Destaco que no te empujan a un juicio eterno si se puede negociar antes. La combinación de abogado y mandatario del automotor nos ahorró muchísimo tiempo.'
    },
    {
      author: 'Camila Herrera',
      rating: 5,
      date: 'Hace 4 meses',
      tag: 'Mediación Comercial',
      text: 'Trato humano, respuesta rápida por WhatsApp y honorarios claros. Nos ayudaron a recuperar una deuda comercial mediante acuerdo firmado sin desgastarnos en tribunales.'
    }
  ]
};
