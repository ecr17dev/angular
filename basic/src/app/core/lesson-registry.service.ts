import { Injectable } from '@angular/core';
import { LessonDefinition } from './lesson-definition';
import { LearningLevel } from './learning-level';

const BASIC_LESSONS: LessonDefinition[] = [
  {
    level: 'basic',
    slug: '01-signals',
    title: 'Signals y estado local',
    goal: 'Dominar signal(), computed() y effect() para estado reactivo en Angular.',
    vueEquivalent: 'ref(), computed() y watch()/watchEffect() en Vue.',
    foundation:
      'En Angular 21, las signals son una base simple para estado local predecible: se leen como funciones y se actualizan sin boilerplate.',
    guidedExample:
      'Construiremos un contador con valor derivado e historial para entender como cambia el estado en tiempo real.',
    vueBridge:
      'Piensalo como ref/computed/watchEffect, pero en Angular el valor de la signal se lee con count() en lugar de .value.',
    quickWins: [
      'Crear estado local sin clases auxiliares.',
      'Derivar informacion con computed().',
      'Separar side effects con effect().'
    ],
    checkpoints: [
      'Actualizar estado con update() y set().',
      'Derivar estado con computed().',
      'Registrar efectos secundarios controlados con effect().'
    ],
    funPrompt: 'Mini reto: llega a 7 y revisa como cambia el historial del efecto.',
    iconKey: 'signals',
    order: 1,
    angularSnippet:
      "const count = signal(0);\nconst doubled = computed(() => count() * 2);\neffect(() => console.log(count()));",
    vueSnippet:
      "const count = ref(0);\nconst doubled = computed(() => count.value * 2);\nwatchEffect(() => console.log(count.value));",
    keyDifferences: [
      'Angular lee signals con count().',
      'Vue usa refs con .value fuera de template.',
      'effect() corre en contexto de inyeccion de Angular.'
    ]
  },
  {
    level: 'basic',
    slug: '02-templates',
    title: 'Templates y control flow',
    goal: 'Practicar bindings y control de flujo nativo con @if, @for y @switch.',
    vueEquivalent: 'v-if, v-for, v-bind:class y v-bind:style.',
    foundation:
      'Angular 21 usa bloques de control flow nativos para que el template sea mas legible y menos verboso.',
    guidedExample:
      'Filtraremos tareas con estados visuales para practicar condicionales, listas y cambios por prioridad.',
    vueBridge:
      'La traduccion desde Vue es directa: v-if/v-for se convierten en @if/@for con track explicito.',
    quickWins: [
      'Usar @if/@else para estados de pantalla.',
      'Iterar con @for y track estable.',
      'Aplicar class/style bindings sin ngClass/ngStyle.'
    ],
    checkpoints: [
      'Condicionales con @if/@else.',
      'Listas con @for y track estable.',
      'Decision por casos con @switch.'
    ],
    funPrompt: 'Mini reto: combina @for con track y resaltado visual por prioridad.',
    iconKey: 'templates',
    order: 2,
    angularSnippet:
      "@if (items().length) {\n  @for (item of items(); track item.id) { ... }\n} @else { ... }",
    vueSnippet:
      "<template v-if=\"items.length\">\n  <li v-for=\"item in items\" :key=\"item.id\">...</li>\n</template>",
    keyDifferences: [
      'Angular usa bloques @if/@for/@switch.',
      'El track en @for es clave para render estable.',
      'Bindings de clase y estilo van en [class.*] y [style.*].'
    ]
  },
  {
    level: 'basic',
    slug: '03-input-output',
    title: 'Comunicacion entre componentes',
    goal: 'Conectar componentes padre/hijo con input() y output().',
    vueEquivalent: 'props y emits.',
    foundation:
      'Angular mantiene flujo unidireccional: el padre controla estado y el hijo comunica eventos al exterior.',
    guidedExample:
      'Un tablero de puntajes donde cada tarjeta hija emite cambios y el padre recalcula el lider.',
    vueBridge:
      'El paralelo con Vue es props/emits, pero en Angular se implementa con funciones input()/output() tipadas.',
    quickWins: [
      'Definir contratos claros de entrada/salida.',
      'Emitir eventos tipados con output().',
      'Mantener estado maestro en el componente padre.'
    ],
    checkpoints: [
      'Definir input() obligatorio y opcional.',
      'Emitir eventos con output().',
      'Sincronizar estado del padre con eventos del hijo.'
    ],
    funPrompt: 'Mini reto: dispara eventos de ambos hijos y verifica el lider automaticamente.',
    iconKey: 'inputOutput',
    order: 3,
    angularSnippet:
      'name = input.required<string>();\nscore = input(0);\nscoreChange = output<number>();',
    vueSnippet:
      'const props = defineProps<{ name: string; score: number }>();\nconst emit = defineEmits<{ scoreChange: [number] }>();',
    keyDifferences: [
      'input()/output() reemplazan decoradores en Angular actual.',
      'El padre sigue siendo fuente de verdad.',
      'Eventos del hijo se tipan de forma explicita.'
    ]
  },
  {
    level: 'basic',
    slug: '04-services-di',
    title: 'Servicios e inyeccion de dependencias',
    goal: 'Compartir estado y reglas de negocio con servicios inyectables.',
    vueEquivalent: 'Composables + provide/inject.',
    foundation:
      'La DI de Angular permite resolver dependencias por jerarquia y aislar logica fuera de los componentes.',
    guidedExample:
      'Usaremos un servicio de sesion para medir minutos de estudio y progreso compartido entre pantallas.',
    vueBridge:
      'Si en Vue usarías composables globales, en Angular esta responsabilidad recae en servicios inyectables.',
    quickWins: [
      'Crear singleton con providedIn: root.',
      'Consumir dependencias con inject().',
      'Centralizar logica de dominio.'
    ],
    checkpoints: [
      'Crear servicio singleton con providedIn: root.',
      'Consumirlo con inject().',
      'Mantener transformaciones puras sobre signals.'
    ],
    funPrompt: 'Mini reto: suma minutos y observa como cambia el progreso global.',
    iconKey: 'services',
    order: 4,
    angularSnippet:
      "@Injectable({ providedIn: 'root' })\nexport class StudySessionService { ... }\nconst service = inject(StudySessionService);",
    vueSnippet:
      'export function useStudySession() { ... }\nconst session = inject(studySessionKey)!;',
    keyDifferences: [
      'Angular usa inyector jerarquico integrado.',
      'inject() funciona en servicios y componentes.',
      'No necesitas wiring manual para singletons base.'
    ]
  },
  {
    level: 'basic',
    slug: '05-router',
    title: 'Router: params, query y navegacion',
    goal: 'Dominar lectura de params/query params y navegacion programatica.',
    vueEquivalent: 'useRoute() y useRouter() de Vue Router.',
    foundation:
      'El router de Angular combina rutas declarativas con APIs imperativas para navegar y reaccionar a cambios de URL.',
    guidedExample:
      'Leeremos slug y query params, luego haremos navegacion programatica con merge de query.',
    vueBridge:
      'La idea es similar a Vue Router, pero en Angular params y query llegan como observables convertibles a signals.',
    quickWins: [
      'Leer params sin parseo manual.',
      'Actualizar query params con merge.',
      'Navegar con Router.navigate().' 
    ],
    checkpoints: [
      'Leer :slug de la URL.',
      'Actualizar query params sin perder contexto.',
      'Navegar programaticamente con Router.navigate().'
    ],
    funPrompt: 'Mini reto: cambia query section y navega al siguiente modulo por codigo.',
    iconKey: 'router',
    order: 5,
    angularSnippet:
      "const route = inject(ActivatedRoute);\nconst router = inject(Router);\nrouter.navigate([], { queryParams: { section: 'params' }, queryParamsHandling: 'merge' });",
    vueSnippet:
      "const route = useRoute();\nconst router = useRouter();\nrouter.push({ query: { ...route.query, section: 'params' } });",
    keyDifferences: [
      'paramMap/queryParamMap se consumen como streams.',
      'toSignal() simplifica uso en template.',
      'queryParamsHandling evita sobrescribir query completa.'
    ]
  },
  {
    level: 'basic',
    slug: '06-reactive-forms',
    title: 'Reactive Forms',
    goal: 'Construir formularios tipados con validaciones y mensajes claros.',
    vueEquivalent: 'v-model + validadores en composables/librerias.',
    foundation:
      'Reactive Forms modela el formulario como estructura de datos tipada con estado, errores y validacion centralizada.',
    guidedExample:
      'Crearemos un formulario de registro con validaciones de required, minLength y email.',
    vueBridge:
      'En lugar de v-model por campo, Angular concentra el estado del formulario en FormControl/FormGroup.',
    quickWins: [
      'Crear formularios tipados con TS.',
      'Aplicar validadores nativos y custom.',
      'Mostrar errores segun touched/invalid.'
    ],
    checkpoints: [
      'Crear FormGroup tipado.',
      'Aplicar Validators (required, minLength, email).',
      'Mostrar errores en base a touched/dirty.'
    ],
    funPrompt: 'Mini reto: intenta enviar vacio, corrige y valida payload final.',
    iconKey: 'forms',
    order: 6,
    angularSnippet:
      "profileForm = new FormGroup({\n  name: new FormControl('', { nonNullable: true, validators: [Validators.required] })\n});",
    vueSnippet:
      "const form = reactive({ name: '' });\nconst errors = computed(() => validate(form));",
    keyDifferences: [
      'Estado y validacion viven en objetos formales.',
      'La UI consume status/errors del modelo.',
      'Menor acoplamiento entre template y reglas.'
    ]
  },
  {
    level: 'basic',
    slug: '07-http-rxjs',
    title: 'HTTP + RxJS',
    goal: 'Consumir datos con HttpClient y manejar loading/error de forma reactiva.',
    vueEquivalent: 'fetch/axios + composables con estado reactivo.',
    foundation:
      'HttpClient opera con Observables y permite pipelines declarativos para transformar datos y controlar errores.',
    guidedExample:
      'Consultaremos un catalogo mock y construiremos estados loading/error de forma predecible.',
    vueBridge:
      'Si vienes de useFetch/axios, aqui el valor agregado es el pipeline RxJS para componer la lectura.',
    quickWins: [
      'Consumir APIs con HttpClient.',
      'Transformar resultados con map().',
      'Controlar errores con rutas de recuperacion.'
    ],
    checkpoints: [
      'Definir servicio API con Observable.',
      'Transformar respuestas con map().',
      'Controlar errores con catchError().'
    ],
    funPrompt: 'Mini reto: ejecuta flujo exitoso y luego simula error de API.',
    iconKey: 'http',
    order: 7,
    angularSnippet:
      'this.api.getCourses().pipe(\n  map((courses) => courses.map(...)),\n  catchError((error) => of([]))\n);',
    vueSnippet: "const { data, error, pending } = await useFetch('/api/courses');",
    keyDifferences: [
      'HttpClient trabaja nativamente con Observables.',
      'RxJS habilita composicion declarativa de operaciones.',
      'Los mocks locales estabilizan aprendizaje y pruebas.'
    ]
  },
  {
    level: 'basic',
    slug: '08-testing-basics',
    title: 'Testing basico con Vitest',
    goal: 'Entender pruebas de componente y servicio en Angular 21.',
    vueEquivalent: 'Vitest + Vue Test Utils.',
    foundation:
      'TestBed permite resolver DI y render de componentes standalone para pruebas unitarias e integradas ligeras.',
    guidedExample:
      'Repasaremos pruebas de componente, rutas y servicios usando Vitest como runner rapido.',
    vueBridge:
      'Si usas mount() en Vue Test Utils, el equivalente mental en Angular es TestBed.createComponent().',
    quickWins: [
      'Montar componentes standalone en tests.',
      'Aislar servicios y dependencias.',
      'Validar rutas y formularios con confianza.'
    ],
    checkpoints: [
      'Configurar TestBed para componentes standalone.',
      'Probar servicios inyectables.',
      'Verificar rutas y formularios en pruebas unitarias.'
    ],
    funPrompt: 'Mini reto: ejecuta pruebas y revisa que cubren rutas, forms y HTTP mock.',
    iconKey: 'testing',
    order: 8,
    angularSnippet:
      "await TestBed.configureTestingModule({ imports: [App] }).compileComponents();\nconst fixture = TestBed.createComponent(App);",
    vueSnippet: "const wrapper = mount(Component);\nexpect(wrapper.text()).toContain('...');",
    keyDifferences: [
      'TestBed resuelve DI y template en un mismo flujo.',
      'Los componentes standalone se importan directo.',
      'RouterTestingHarness simplifica escenarios de navegacion.'
    ]
  }
];

const MEDIUM_LESSONS: LessonDefinition[] = [
  {
    level: 'medium',
    slug: '01-feature-architecture',
    title: 'Feature Architecture para SaaS',
    goal: 'Estructurar una app por features standalone con boundaries claros y escalables.',
    vueEquivalent: 'Arquitectura por dominios con composables + módulos de feature.',
    foundation:
      'En nivel medio organizamos la app por dominios del Panel SaaS de tareas para reducir acoplamiento y mejorar mantenibilidad.',
    guidedExample:
      'Separaremos areas de backlog, tablero y reportes con rutas y servicios dedicados por feature.',
    vueBridge:
      'Desde Vue, piensa en carpetas por dominio; en Angular formalizamos esos boundaries con rutas lazy y proveedores de feature.',
    quickWins: [
      'Definir boundaries por dominio de negocio.',
      'Evitar carpetas tecnicas mezcladas.',
      'Preparar base para escalado real.'
    ],
    checkpoints: [
      'Separar componentes y servicios por feature.',
      'Mantener dependencias unidireccionales.',
      'Configurar rutas lazy por dominio.'
    ],
    funPrompt: 'Reto: mapea backlog y reportes como features aisladas del panel.',
    iconKey: 'services',
    order: 1,
    angularSnippet:
      "export const TASK_BOARD_ROUTES: Routes = [{ path: '', loadComponent: () => import('./task-board.page') }];",
    vueSnippet: "const routes = [{ path: '/board', component: () => import('./BoardPage.vue') }];",
    keyDifferences: [
      'Angular favorece providers y rutas por feature como boundary formal.',
      'Vue suele depender mas de convencion de carpetas.',
      'El inyector ayuda a encapsular servicios por feature.'
    ]
  },
  {
    level: 'medium',
    slug: '02-signal-store-patterns',
    title: 'Signal Store Patterns',
    goal: 'Modelar estado compartido con servicios + signals derivadas para varias vistas.',
    vueEquivalent: 'Pinia/composables con estado reactivo compartido.',
    foundation:
      'Las signals en servicios permiten construir stores ligeros sin libreria extra para casos productivos comunes.',
    guidedExample:
      'Crearemos un TaskStore con filtros, tareas activas y metricas derivadas para tablero SaaS.',
    vueBridge:
      'Piensalo como un store de Pinia, pero con computed y señales nativas de Angular.',
    quickWins: [
      'Centralizar estado compartido por dominio.',
      'Exponer selectores derivados con computed.',
      'Mantener actualizaciones inmutables y legibles.'
    ],
    checkpoints: [
      'Definir signal store en servicio.',
      'Exponer estado de solo lectura.',
      'Crear selectores derivados reutilizables.'
    ],
    funPrompt: 'Reto: agrega selector de tareas vencidas sin romper el resto del store.',
    iconKey: 'signals',
    order: 2,
    angularSnippet:
      "private readonly tasks = signal<Task[]>([]);\nreadonly openTasks = computed(() => this.tasks().filter((t) => !t.done));",
    vueSnippet:
      "const tasks = ref<Task[]>([]);\nconst openTasks = computed(() => tasks.value.filter((t) => !t.done));",
    keyDifferences: [
      'Angular usa signals como funciones en store y consumidor.',
      'No requiere plugin extra para casos medios.',
      'inject() simplifica consumo cross-feature.'
    ]
  },
  {
    level: 'medium',
    slug: '03-router-advanced',
    title: 'Router avanzado: guards y resolvers',
    goal: 'Aplicar child routes, guards y resolvers en flujos reales de navegacion.',
    vueEquivalent: 'Vue Router con beforeEnter y carga previa de datos.',
    foundation:
      'Router avanzado permite proteger rutas, precargar datos de pantalla y mantener UX estable en cambios de contexto.',
    guidedExample:
      'Montaremos rutas hijas del panel con guard de acceso y resolver de proyecto actual.',
    vueBridge:
      'Equivale a beforeEach/beforeEnter en Vue, pero Angular integra guard/resolver como piezas tipadas separadas.',
    quickWins: [
      'Proteger rutas sensibles del panel.',
      'Resolver datos antes de render.',
      'Reducir estados intermedios innecesarios.'
    ],
    checkpoints: [
      'Configurar guard funcional.',
      'Configurar resolver con datos iniciales.',
      'Usar child routes por seccion del panel.'
    ],
    funPrompt: 'Reto: bloquea acceso a reportes si no hay workspace activo.',
    iconKey: 'router',
    order: 3,
    angularSnippet:
      "{ path: 'reports', canActivate: [authGuard], resolve: { workspace: workspaceResolver }, loadComponent: ... }",
    vueSnippet: "{ path: '/reports', beforeEnter: ensureAuth, component: ReportsPage }",
    keyDifferences: [
      'Guards y resolvers son artefactos dedicados en Angular.',
      'El tipado de datos resueltos mejora seguridad en runtime.',
      'La composicion por child routes es mas estructurada.'
    ]
  },
  {
    level: 'medium',
    slug: '04-http-interceptors',
    title: 'HTTP Interceptors productivos',
    goal: 'Implementar auth mock, manejo global de errores y control de requests con interceptores.',
    vueEquivalent: 'Axios interceptors + middleware de peticiones.',
    foundation:
      'Los interceptores centralizan preocupaciones transversales como auth, tracing y estrategias de error/retry.',
    guidedExample:
      'Crearemos un interceptor para token mock y otro para normalizar errores del API de tareas.',
    vueBridge:
      'Es similar a interceptors de axios, pero en Angular se integra directamente con HttpClient.',
    quickWins: [
      'Inyectar headers globales sin repetir codigo.',
      'Normalizar errores para UI consistente.',
      'Preparar base para politicas de retry/cancel.'
    ],
    checkpoints: [
      'Implementar interceptor funcional.',
      'Manejar error global de API.',
      'Integrar interceptor en providers de app.'
    ],
    funPrompt: 'Reto: marca requests de prioridad alta con un header dedicado.',
    iconKey: 'http',
    order: 4,
    angularSnippet:
      "export const authInterceptor: HttpInterceptorFn = (req, next) => next(req.clone({ setHeaders: { Authorization: 'Bearer mock' } }));",
    vueSnippet: "axios.interceptors.request.use((config) => ({ ...config, headers: { ...config.headers, Authorization: token } }));",
    keyDifferences: [
      'Angular integra interceptores en el pipeline de HttpClient.',
      'Puedes componer multiples interceptores por responsabilidad.',
      'El tipado de requests/responses se mantiene en todo el flujo.'
    ]
  },
  {
    level: 'medium',
    slug: '05-reactive-forms-advanced',
    title: 'Reactive Forms avanzados',
    goal: 'Diseñar formularios dinamicos con validadores custom y UX de error de nivel medio.',
    vueEquivalent: 'Form composables avanzados con reglas y estado contextual.',
    foundation:
      'En escenarios productivos, los formularios requieren validacion cruzada, estructuras dinamicas y errores contextuales.',
    guidedExample:
      'Construiremos un formulario de tarea con fechas, responsables y validaciones entre campos.',
    vueBridge:
      'La idea se parece a composables de form, pero Angular mantiene todo en FormGroup/FormArray tipados.',
    quickWins: [
      'Crear validadores custom reutilizables.',
      'Usar FormArray para bloques dinamicos.',
      'Unificar mensajes de error por criterio de UX.'
    ],
    checkpoints: [
      'Agregar validator cross-field.',
      'Gestionar FormArray dinamico.',
      'Mostrar errores con estrategia consistente.'
    ],
    funPrompt: 'Reto: impedir que fecha de cierre sea menor a fecha de inicio.',
    iconKey: 'forms',
    order: 5,
    angularSnippet:
      "const dateRangeValidator: ValidatorFn = (group) => group.value.start <= group.value.end ? null : { invalidRange: true };",
    vueSnippet: "const errors = computed(() => validateTaskForm(form));",
    keyDifferences: [
      'Angular favorece validators formales y reusables.',
      'FormArray cubre escenarios dinamicos complejos.',
      'El estado de errores vive en el modelo, no en watchers sueltos.'
    ]
  },
  {
    level: 'medium',
    slug: '06-rxjs-orchestration',
    title: 'Orquestacion RxJS',
    goal: 'Combinar streams de filtros, busqueda y contexto con operadores productivos.',
    vueEquivalent: 'Watchers/composables con streams reactivos avanzados.',
    foundation:
      'RxJS permite coordinar eventos de usuario, estado de filtro y peticiones remotas de forma declarativa.',
    guidedExample:
      'Orquestaremos busqueda de tareas con combineLatest, debounce y switchMap hacia API mock.',
    vueBridge:
      'Desde Vue puede parecer una mezcla de watch y composables, pero RxJS formaliza la orquestacion en un solo pipeline.',
    quickWins: [
      'Reducir codigo imperativo de listeners.',
      'Cancelar requests obsoletas con switchMap.',
      'Componer filtros en pipeline mantenible.'
    ],
    checkpoints: [
      'Combinar streams con combineLatest.',
      'Aplicar debounce/switchMap en busqueda.',
      'Mapear resultado a estado de UI.'
    ],
    funPrompt: 'Reto: agrega filtro por prioridad sin romper la busqueda actual.',
    iconKey: 'templates',
    order: 6,
    angularSnippet:
      "combineLatest([query$, status$]).pipe(debounceTime(250), switchMap(([q, status]) => this.api.search(q, status)));",
    vueSnippet: "watch([query, status], () => runSearch(), { flush: 'post' });",
    keyDifferences: [
      'Angular+RxJS formaliza streams declarativos.',
      'switchMap evita condiciones de carrera de red.',
      'El pipeline concentra transformaciones y side effects.'
    ]
  },
  {
    level: 'medium',
    slug: '07-performance-lazy',
    title: 'Performance y lazy rendering',
    goal: 'Optimizar rendimiento con lazy loading, @defer y estrategias de render eficiente.',
    vueEquivalent: 'Code splitting, Suspense y optimizacion de listas.',
    foundation:
      'Nivel medio exige controlar costo de render y carga inicial para que el panel escale sin degradar UX.',
    guidedExample:
      'Aplicaremos lazy por feature y defer para paneles secundarios del dashboard.',
    vueBridge:
      'Se parece a dynamic imports y Suspense en Vue, pero Angular agrega @defer y control directo del router lazy.',
    quickWins: [
      'Reducir bundle inicial por ruta.',
      'Diferir contenido no critico.',
      'Evitar rerender innecesario en listas.'
    ],
    checkpoints: [
      'Configurar lazy por feature.',
      'Aplicar @defer en bloques secundarios.',
      'Usar tracking estable en colecciones.'
    ],
    funPrompt: 'Reto: mueve reportes pesados a carga diferida y mide mejora percibida.',
    iconKey: 'templates',
    order: 7,
    angularSnippet:
      "@defer (on viewport) { <app-heavy-report /> } @placeholder { <app-report-skeleton /> }",
    vueSnippet: "const Report = defineAsyncComponent(() => import('./Report.vue'));",
    keyDifferences: [
      '@defer ofrece control declarativo de render diferido.',
      'Lazy routes son parte nativa del router Angular.',
      'Performance se aborda como parte del diseño del feature.'
    ]
  },
  {
    level: 'medium',
    slug: '08-testing-integration',
    title: 'Testing de integracion Angular',
    goal: 'Probar flujos integrados de router, forms y HTTP con Vitest/TestBed.',
    vueEquivalent: 'Integration tests con Vue Test Utils + mocks de red/router.',
    foundation:
      'El nivel medio incorpora pruebas de integracion para validar comportamiento real entre multiples capas.',
    guidedExample:
      'Construiremos escenarios de panel SaaS que cruzan ruta protegida, formulario y peticion HTTP mock.',
    vueBridge:
      'Como en Vue integration testing, pero en Angular se apoya en TestBed y RouterTestingHarness.',
    quickWins: [
      'Validar flujos end-to-end de feature.',
      'Detectar regresiones de integracion.',
      'Aumentar confianza antes de despliegue.'
    ],
    checkpoints: [
      'Configurar pruebas de integracion con harness.',
      'Mockear HTTP y navegar rutas en el test.',
      'Validar interaccion form + API + UI final.'
    ],
    funPrompt: 'Reto: prueba flujo completo de crear tarea y ver confirmacion en tablero.',
    iconKey: 'testing',
    order: 8,
    angularSnippet:
      "const harness = await RouterTestingHarness.create();\nawait harness.navigateByUrl('/medium/lessons/08-testing-integration');",
    vueSnippet: "const wrapper = mount(App, { global: { plugins: [router] } });",
    keyDifferences: [
      'Angular integra router harness y TestBed en un flujo consistente.',
      'Permite mockear DI y HTTP sin plugins externos.',
      'Los escenarios se aproximan a uso real de feature.'
    ]
  }
];

const LESSONS = [...BASIC_LESSONS, ...MEDIUM_LESSONS];

@Injectable({ providedIn: 'root' })
export class LessonRegistryService {
  getLessons(level: LearningLevel): LessonDefinition[] {
    return LESSONS.filter((lesson) => lesson.level === level).sort((a, b) => a.order - b.order);
  }

  getBySlug(level: LearningLevel, slug: string): LessonDefinition | undefined {
    return this.getLessons(level).find((lesson) => lesson.slug === slug);
  }

  getAdjacent(level: LearningLevel, slug: string): { previous?: LessonDefinition; next?: LessonDefinition } {
    const lessons = this.getLessons(level);
    const currentIndex = lessons.findIndex((lesson) => lesson.slug === slug);

    if (currentIndex === -1) {
      return {};
    }

    return {
      previous: lessons[currentIndex - 1],
      next: lessons[currentIndex + 1]
    };
  }
}
