# Feature-First Architecture

Esta estructura organiza el código por características/funcionalidades en lugar de por capas técnicas.

## Estructura

```
src/features/
├── customers/
│   ├── ui/
│   │   ├── CustomersPage.js       # Página principal
│   │   ├── CustomerCard.js        # Componente de tarjeta
│   │   ├── CustomerForm.js        # Formulario
│   │   └── hooks.js              # React hooks específicos
│   ├── api/
│   │   └── adapter.js            # Llamadas HTTP
│   └── model/
│       └── types.js              # Tipos y validaciones
├── accounts/
├── transactions/
└── reports/
```

## Ventajas

✅ **Fácil de entender**: Todo lo relacionado con una funcionalidad está junto
✅ **Fácil de encontrar**: No hay que saltar entre muchas carpetas
✅ **Escalable**: Añadir nuevas features es directo
✅ **Mantenible**: Cambios en una feature no afectan otras