import { Injectable } from '@angular/core';
import { LearningLevel } from '../core/learning-level';
import { PracticeChallenge } from './practice-challenge';

const BASIC_TEMPLATE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'templates-if-else',
    level: 'basic',
    lessonSlug: '02-templates',
    title: 'Reto 1: @if y @else',
    instructions:
      'Completa un bloque de control de flujo para mostrar un mensaje distinto cuando el usuario no este autenticado.',
    starterCode: `const isLoggedIn = true;

@if (isLoggedIn) {
  <p>Bienvenido de nuevo</p>
}
`,
    expectedConcepts: [
      'Usar bloque @if con una condicion.',
      'Agregar @else para el caso alternativo.',
      'Mostrar ambos textos de salida en ramas distintas.'
    ],
    scenarios: [
      {
        id: 'logged-in',
        title: 'Usuario autenticado',
        contextDescription: 'isLoggedIn = true',
        expectedPreview: 'Bienvenido de nuevo'
      },
      {
        id: 'logged-out',
        title: 'Usuario no autenticado',
        contextDescription: 'isLoggedIn = false',
        expectedPreview: 'Inicia sesion'
      }
    ],
    tests: [
      {
        id: 'if-else-block',
        description: 'Incluye estructura @if y @else',
        type: 'containsAll',
        tokens: ['@if', '@else'],
        successMessage: 'Detectado bloque @if/@else completo.',
        failureMessage: 'Falta la estructura completa @if/@else.',
        hints: [
          'Agrega @else despues del bloque @if.',
          'Estructura esperada: @if (...) { ... } @else { ... }'
        ]
      },
      {
        id: 'if-condition',
        description: 'Tiene una condicion valida en @if',
        type: 'regex',
        pattern: '@if\\s*\\([^)]*\\)',
        successMessage: 'La condicion de @if tiene forma valida.',
        failureMessage: 'No se detecta una condicion en @if.',
        hints: [
          'Usa parentesis despues de @if.',
          'Ejemplo: @if (isLoggedIn) { ... }'
        ]
      },
      {
        id: 'if-texts',
        description: 'Incluye mensajes para ambos casos',
        type: 'containsAll',
        tokens: ['Bienvenido de nuevo', 'Inicia sesion'],
        successMessage: 'Mensajes para estado true/false encontrados.',
        failureMessage: 'Falta un mensaje para alguno de los estados.',
        hints: [
          'Incluye texto para el caso autenticado y no autenticado.',
          'Se esperan los textos "Bienvenido de nuevo" e "Inicia sesion".'
        ]
      }
    ]
  },
  {
    id: 'templates-for-track',
    level: 'basic',
    lessonSlug: '02-templates',
    title: 'Reto 2: @for con track',
    instructions: 'Itera una lista de items con @for y define track para estabilidad de render.',
    starterCode: `const items = [
  { id: 1, name: 'Angular' },
  { id: 2, name: 'Vue' }
];

<ul>
  @for (item of items; ) {
    <li>{{ item.name }}</li>
  }
</ul>`,
    expectedConcepts: [
      'Usar @for para recorrer items.',
      'Declarar track item.id.',
      'Renderizar una propiedad por cada elemento.'
    ],
    scenarios: [
      {
        id: 'initial-list',
        title: 'Lista inicial',
        contextDescription: 'items tiene 2 elementos',
        expectedPreview: '1. Angular\n2. Vue'
      },
      {
        id: 'extended-list',
        title: 'Lista extendida',
        contextDescription: 'items tiene 3 elementos',
        expectedPreview: '1. Angular\n2. Vue\n3. Svelte'
      }
    ],
    tests: [
      {
        id: 'for-has-track',
        description: 'Incluye token track dentro de @for',
        type: 'containsAll',
        tokens: ['@for', 'track'],
        successMessage: 'Se detecta @for con track.',
        failureMessage: 'Falta track en el bloque @for.',
        hints: [
          'En Angular 21 usa track en @for.',
          'Ejemplo: @for (item of items; track item.id) { ... }'
        ]
      },
      {
        id: 'for-track-shape',
        description: 'Estructura de @for; track ... valida',
        type: 'regex',
        pattern: '@for\\s*\\([^)]*;\\s*track\\s+[^)]+\\)',
        successMessage: 'La estructura de track es valida.',
        failureMessage: 'No se detecta un track valido en @for.',
        hints: [
          'Agrega ; track item.id en la declaracion de @for.',
          'No dejes vacia la parte despues del punto y coma.'
        ]
      },
      {
        id: 'for-item-render',
        description: 'Renderiza item.name en el contenido',
        type: 'containsAll',
        tokens: ['item.name'],
        successMessage: 'Render de item.name detectado.',
        failureMessage: 'Falta imprimir item.name en la lista.',
        hints: [
          'Usa interpolacion {{ item.name }}.',
          'Cada li debe mostrar el nombre del item.'
        ]
      }
    ]
  },
  {
    id: 'templates-switch',
    level: 'basic',
    lessonSlug: '02-templates',
    title: 'Reto 3: @switch, @case y @default',
    instructions: 'Implementa una salida por rol usando @switch con al menos dos @case y un @default.',
    starterCode: `const role = 'admin';

@switch (role) {
  @case ('admin') {
    <p>Panel total</p>
  }
}`,
    expectedConcepts: [
      'Usar @switch con expresion.',
      'Agregar dos @case.',
      'Agregar @default para fallback.'
    ],
    scenarios: [
      {
        id: 'role-admin',
        title: 'Rol admin',
        contextDescription: "role = 'admin'",
        expectedPreview: 'Panel total'
      },
      {
        id: 'role-guest',
        title: 'Rol invitado',
        contextDescription: "role = 'guest'",
        expectedPreview: 'Acceso basico'
      }
    ],
    tests: [
      {
        id: 'switch-structure',
        description: 'Incluye @switch, @case y @default',
        type: 'containsAll',
        tokens: ['@switch', '@case', '@default'],
        successMessage: 'Estructura de @switch completa detectada.',
        failureMessage: 'Falta @switch, @case o @default.',
        hints: [
          'Asegura un bloque @default al final.',
          'Debe existir al menos un @case y un @default.'
        ]
      },
      {
        id: 'switch-has-two-cases',
        description: 'Define casos para admin y guest',
        type: 'containsAll',
        tokens: ["'admin'", "'guest'"],
        successMessage: 'Casos admin y guest detectados.',
        failureMessage: 'No se detectan ambos casos admin/guest.',
        hints: [
          "Agrega @case ('guest') con su contenido.",
          'Verifica que admin y guest aparezcan en casos separados.'
        ]
      }
    ]
  },
  {
    id: 'templates-class-style',
    level: 'basic',
    lessonSlug: '02-templates',
    title: 'Reto 4: Binding de clase y estilo',
    instructions: 'Aplica un class binding y un style binding para reflejar estado visual de una tarjeta.',
    starterCode: `const isActive = true;

<div class="card">
  Tarjeta de ejemplo
</div>`,
    expectedConcepts: [
      'Usar [class.algo] para una clase condicional.',
      'Usar [style.prop] para estilo dinamico.',
      'Mantener estructura simple y legible.'
    ],
    scenarios: [
      {
        id: 'active-card',
        title: 'Tarjeta activa',
        contextDescription: 'isActive = true',
        expectedPreview: 'Clase activa aplicada y color destacado'
      },
      {
        id: 'inactive-card',
        title: 'Tarjeta inactiva',
        contextDescription: 'isActive = false',
        expectedPreview: 'Clase activa ausente y color neutro'
      }
    ],
    tests: [
      {
        id: 'class-binding',
        description: 'Incluye class binding',
        type: 'regex',
        pattern: '\\[class\\.[^\\]]+\\]',
        successMessage: 'Class binding detectado.',
        failureMessage: 'No se encontro class binding [class.*].',
        hints: [
          'Prueba con [class.active]="isActive".',
          'Usa la sintaxis [class.nombreClase].'
        ]
      },
      {
        id: 'style-binding',
        description: 'Incluye style binding',
        type: 'regex',
        pattern: '\\[style\\.[^\\]]+\\]',
        successMessage: 'Style binding detectado.',
        failureMessage: 'No se encontro style binding [style.*].',
        hints: [
          'Prueba con [style.border-color]="isActive ? ...".',
          'Usa la sintaxis [style.prop].'
        ]
      }
    ]
  }
];

const MEDIUM_CHALLENGES: PracticeChallenge[] = [
  createMediumChallenge({
    id: 'medium-feature-architecture',
    lessonSlug: '01-feature-architecture',
    title: 'Feature Architecture por dominios',
    instructions:
      'Define una ruta lazy de feature para board usando loadChildren y separacion por dominio.',
    starterCode: `export const routes: Routes = [
  // TODO: agrega ruta lazy para board
];`,
    tokens: ['loadChildren', "path: 'board'", 'Routes']
  }),
  createMediumChallenge({
    id: 'medium-signal-store',
    lessonSlug: '02-signal-store-patterns',
    title: 'Signal Store en servicio',
    instructions:
      'Modela un store de tareas con signal y computed en servicio para estado compartido.',
    starterCode: `private tasks = signal<Task[]>([]);
// TODO: agrega selector derivado`,
    tokens: ['signal', 'computed', 'tasks']
  }),
  createMediumChallenge({
    id: 'medium-router-advanced',
    lessonSlug: '03-router-advanced',
    title: 'Guard + resolver en ruta',
    instructions: 'Configura una ruta de reportes con canActivate y resolve para datos previos.',
    starterCode: `{
  path: 'reports',
  // TODO: guard y resolver
}`,
    tokens: ['canActivate', 'resolve', "path: 'reports'"]
  }),
  createMediumChallenge({
    id: 'medium-http-interceptors',
    lessonSlug: '04-http-interceptors',
    title: 'Interceptor HTTP de auth mock',
    instructions:
      'Implementa un interceptor funcional que inyecte Authorization y preserve la request original.',
    starterCode: `export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO
  return next(req);
};`,
    tokens: ['HttpInterceptorFn', 'setHeaders', 'Authorization']
  }),
  createMediumChallenge({
    id: 'medium-forms-advanced',
    lessonSlug: '05-reactive-forms-advanced',
    title: 'Validator cross-field',
    instructions:
      'Crea un validator de rango de fechas que retorne error cuando start > end.',
    starterCode: `const rangeValidator: ValidatorFn = (group) => {
  // TODO
  return null;
};`,
    tokens: ['ValidatorFn', 'start', 'end']
  }),
  createMediumChallenge({
    id: 'medium-rxjs-orchestration',
    lessonSlug: '06-rxjs-orchestration',
    title: 'Busqueda orquestada con RxJS',
    instructions:
      'Combina query y status con combineLatest y usa switchMap para cancelar busquedas previas.',
    starterCode: `combineLatest([query$, status$])
  // TODO
`,
    tokens: ['combineLatest', 'switchMap', 'query$']
  }),
  createMediumChallenge({
    id: 'medium-performance-lazy',
    lessonSlug: '07-performance-lazy',
    title: '@defer y carga diferida',
    instructions:
      'Escribe un bloque @defer con placeholder para un widget pesado de reportes.',
    starterCode: `// TODO: bloque @defer para widget pesado`,
    tokens: ['@defer', '@placeholder', 'widget']
  }),
  createMediumChallenge({
    id: 'medium-testing-integration',
    lessonSlug: '08-testing-integration',
    title: 'Test de integracion con RouterTestingHarness',
    instructions:
      'Crea un test que navegue por URL y valide que la pantalla de tareas renderiza correctamente.',
    starterCode: `it('navega y renderiza', async () => {
  // TODO
});`,
    tokens: ['RouterTestingHarness', 'navigateByUrl', 'expect']
  })
];

const CHALLENGES = [...BASIC_TEMPLATE_CHALLENGES, ...MEDIUM_CHALLENGES];

@Injectable({ providedIn: 'root' })
export class PracticeRegistryService {
  getByLesson(level: LearningLevel, lessonSlug: string): PracticeChallenge[] {
    return CHALLENGES.filter((challenge) => challenge.level === level && challenge.lessonSlug === lessonSlug);
  }

  getChallenge(level: LearningLevel, lessonSlug: string, challengeId: string): PracticeChallenge | undefined {
    return this.getByLesson(level, lessonSlug).find((challenge) => challenge.id === challengeId);
  }
}

function createMediumChallenge(params: {
  id: string;
  lessonSlug: string;
  title: string;
  instructions: string;
  starterCode: string;
  tokens: string[];
}): PracticeChallenge {
  return {
    id: params.id,
    level: 'medium',
    lessonSlug: params.lessonSlug,
    title: params.title,
    instructions: params.instructions,
    starterCode: params.starterCode,
    expectedConcepts: [
      'Aplicar sintaxis Angular del tema.',
      'Mantener estructura orientada a panel SaaS de tareas.',
      'Cumplir los tokens tecnicos obligatorios del modulo.'
    ],
    scenarios: [
      {
        id: 'default',
        title: 'Escenario principal',
        contextDescription: `Modulo ${params.lessonSlug} del panel SaaS`,
        expectedPreview: 'La solucion respeta el patron productivo esperado.'
      }
    ],
    tests: [
      {
        id: `${params.id}-tokens`,
        description: 'Incluye tokens obligatorios del modulo',
        type: 'containsAll',
        tokens: params.tokens,
        successMessage: 'Se detectan los tokens clave del modulo medio.',
        failureMessage: 'Faltan conceptos obligatorios del ejercicio medio.',
        hints: [
          'Revisa la consigna y agrega los elementos tecnicos faltantes.',
          `Deben aparecer estos tokens: ${params.tokens.join(', ')}`
        ]
      }
    ]
  };
}
