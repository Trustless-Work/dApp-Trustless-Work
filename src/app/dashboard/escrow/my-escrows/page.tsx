"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const escrowData = [
  {
    uid: "1",
    serviceProvider: "0x123...abc",
    amount: "100 USDC",
    milestones: "3/5 completed",
  },
  {
    uid: "2",
    serviceProvider: "0x456...def",
    amount: "200 USDC",
    milestones: "2/4 completed",
  },
  {
    uid: "3",
    serviceProvider: "0x789...ghi",
    amount: "150 USDC",
    milestones: "1/3 completed",
  },
  {
    uid: "4",
    serviceProvider: "0xabc...123",
    amount: "300 USDC",
    milestones: "4/6 completed",
  },
  {
    uid: "5",
    serviceProvider: "0xdef...456",
    amount: "250 USDC",
    milestones: "2/5 completed",
  },
  {
    uid: "6",
    serviceProvider: "0xghi...789",
    amount: "350 USDC",
    milestones: "5/5 completed",
  },
  {
    uid: "7",
    serviceProvider: "0xjkl...012",
    amount: "400 USDC",
    milestones: "3/6 completed",
  },
  {
    uid: "8",
    serviceProvider: "0xopq...345",
    amount: "180 USDC",
    milestones: "1/2 completed",
  },
  {
    uid: "9",
    serviceProvider: "0xstu...678",
    amount: "220 USDC",
    milestones: "4/4 completed",
  },
  {
    uid: "10",
    serviceProvider: "0xvwx...901",
    amount: "260 USDC",
    milestones: "2/5 completed",
  },
];

export default function EscrowDataPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const totalPages = Math.ceil(escrowData.length / itemsPerPage);
  const currentData = escrowData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Escrow Data</h1>

      <div className="mb-4 flex items-center space-x-4">
        <label htmlFor="itemsPerPage" className="font-medium">
          Items per page:
        </label>
        <Input
          id="itemsPerPage"
          type="number"
          min="1"
          max={escrowData.length}
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value) || 1);
            setCurrentPage(1);
          }}
          className="w-20"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">UID</TableHead>
              <TableHead>Service Provider</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Milestones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row) => (
              <TableRow key={row.uid} className="animate-fade-in">
                <TableCell className="font-medium">{row.uid}</TableCell>
                <TableCell>{row.serviceProvider}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.milestones}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={
              currentPage === index + 1
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
