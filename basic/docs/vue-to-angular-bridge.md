# Guia puente Vue -> Angular 21

## Glosario rapido
- `ref()` (Vue) -> `signal()` (Angular)
- `computed()` (Vue) -> `computed()` (Angular)
- `watch/watchEffect` (Vue) -> `effect()` (Angular)
- `props` + `emits` (Vue) -> `input()` + `output()` (Angular)
- `useRoute/useRouter` (Vue Router) -> `ActivatedRoute` + `Router`
- `composable compartido` (Vue) -> `service` inyectable con `providedIn: 'root'`
- `v-model` + reglas -> `Reactive Forms`
- `useFetch/axios composable` -> `HttpClient` + pipeline RxJS

## Diferencias criticas

### 1) Reactividad
- Angular usa funciones para leer signals (`count()`).
- Vue usa `.value` en refs fuera de template.
- En Angular, `effect()` vive en contexto de inyeccion y es ideal para side effects controlados.

### 2) Templates
- Angular 21 prioriza control flow con bloques `@if`, `@for`, `@switch`.
- Vue usa directivas `v-if`, `v-for`, `v-show`.
- Angular separa con mas fuerza la logica de presentacion del modelo de formulario/servicio.

### 3) DI y servicios
- Angular incorpora DI como eje del framework; no es opcional ni plugin.
- En Vue normalmente compones estado via composables y provide/inject segun necesidad.
- En Angular, `inject()` y servicios singleton simplifican estado compartido transversal.

### 4) Flujo de datos
- Ambos favorecen flujo unidireccional.
- Angular explicita contrato padre/hijo con `input()/output()` tipados.
- Eventos del hijo no mutan directamente el estado global: el padre decide como actualizar.

## Orden recomendado de estudio
1. `01-signals`
2. `02-templates`
3. `03-input-output`
4. `04-services-di`
5. `05-router`
6. `06-reactive-forms`
7. `07-http-rxjs`
8. `08-testing-basics`
