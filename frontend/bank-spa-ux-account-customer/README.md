# 🏦 Bank SPA - Customer Management

Sistema de gestión bancaria con arquitectura **Feature-First** para mayor simplicidad y mantenibilidad.

## 🏗️ Arquitectura

### Feature-First Structure
Organizamos el código por funcionalidades, no por capas técnicas.

```
src/
├── features/                    # 🎯 Funcionalidades organizadas por dominio
│   └── customers/              # Feature: Gestión de Clientes
│       ├── ui/                 # Componentes React específicos
│       │   ├── CustomersPage.js    # Página principal
│       │   ├── CustomerCard.js     # Tarjeta de cliente
│       │   ├── CustomerForm.js     # Formulario
│       │   └── hooks.js           # React hooks específicos
│       ├── api/                # Adaptador para llamadas HTTP
│       │   └── adapter.js
│       └── model/              # Tipos y lógica de negocio
│           └── types.js
├── components/                 # 🎨 Componentes globales (layout, dashboard)
│   └── BankDashboard.js       # Dashboard principal con navegación
└── App.js                     # Punto de entrada
```

## ✅ Ventajas de esta Arquitectura

1. **🎯 Simple y Directa**: Todo relacionado con una funcionalidad está junto
2. **🔍 Fácil de Encontrar**: No hay que saltar entre múltiples carpetas
3. **🚀 Escalable**: Añadir nuevas features es directo
4. **🛠️ Mantenible**: Los cambios están localizados
5. **👥 Amigable para Nuevos Desarrolladores**: Estructura intuitiva

## 🚀 Características Implementadas

### Dashboard Bancario Moderno
- ✅ **Navegación por módulos**: Clientes, Cuentas, Movimientos, Reportes
- ✅ **Diseño responsive** con gradientes modernos
- ✅ **Animaciones suaves** y efectos hover

### Gestión de Clientes (Feature Complete)
- ✅ **CRUD completo**: Crear, leer, actualizar, eliminar
- ✅ **Validaciones**: Formulario con validación en tiempo real
- ✅ **Estado de carga**: Spinners y manejo de errores
- ✅ **Mock API**: Datos de prueba con delays realistas
- ✅ **Responsive**: Funciona en móvil y desktop

### Módulos Adicionales (Demo)
- ✅ **Cuentas**: Tarjetas con información de balances
- ✅ **Movimientos**: Lista de transacciones con filtros
- ✅ **Reportes**: Dashboard con métricas y gráficos

## 🛠️ Tecnologías

- **React 19.1.1**: Framework frontend
- **CSS-in-JS**: Styled-jsx para estilos encapsulados
- **Feature-First Architecture**: Organización por funcionalidades
- **Mock API**: Simulación de backend con delays realistas

## 🏃‍♂️ Cómo Ejecutar

```bash
npm start
# Abrir http://localhost:3000
```

## 📈 Próximos Pasos

1. **Conectar Backend Real**: Cambiar `adapter.js` para llamadas HTTP reales
2. **Agregar React Query**: Para mejor manejo de estado del servidor
3. **Implementar Autenticación**: Login y roles de usuario
4. **Añadir Tests**: Unit tests para cada feature
5. **Expandir Features**: Accounts, Transactions, Reports completos

## 💡 Filosofía de Desarrollo

> "Empezar simple, crecer inteligentemente"

Esta estructura permite comenzar con algo simple y funcional, pero está preparada para escalar a una aplicación empresarial sin refactorizar la arquitectura base.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
