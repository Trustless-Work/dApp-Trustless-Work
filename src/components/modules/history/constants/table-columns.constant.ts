import { HistoryTableColumn } from "../@types/history.entity";

export const getHistoryTableColumns = (): HistoryTableColumn[] => {
  return [
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      sortable: true,
      filterable: true,
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      sortable: true,
      filterable: true,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      filterable: true,
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance",
      sortable: true,
      filterable: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "flags",
      sortable: true,
      filterable: true,
    },
    {
      id: "serviceProvider",
      header: "Service Provider",
      accessorKey: "roles",
      sortable: true,
      filterable: true,
    },
    {
      id: "approver",
      header: "Approver",
      accessorKey: "roles",
      sortable: true,
      filterable: true,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      sortable: true,
      filterable: true,
    },
    {
      id: "lastActivity",
      header: "Last Activity",
      accessorKey: "lastActivity",
      sortable: true,
      filterable: true,
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "id",
      sortable: false,
      filterable: false,
    },
  ];
};
