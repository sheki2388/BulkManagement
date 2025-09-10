# Installation & Running

## 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

## 2. Install dependencies

```sh
npm install
```

## 3. Start the development server

```sh
npm run dev
```


## 4. Access the app

- Create page: [http://localhost:8080/bulk/create](http://localhost:8080/bulk/create)
- Export page: [http://localhost:8080/bulk/export](http://localhost:8080/bulk/export)
- Import page: [http://localhost:8080/bulk/import](http://localhost:8080/bulk/import)

Replace 'localhost' with your network IP if accessing from another device.

# Features

- **Create Page**: Add new offers with all fields and logic.
- **Export Page**: View, filter, and export offers. Status/type filtering, export actions, and UI customizations.
- **Import Page**: Preloads logical sample offers from a mocked backend. Supports pagination (10 offers per page) with Previous/Next navigation. Sample offers have realistic types, statuses, names, and rules for demonstration.

# Pagination Demo

On the Import page, you can view paginated offers. Each page loads 10 logical offers, and you can navigate using the Previous/Next buttons. This simulates backend pagination for large datasets.
