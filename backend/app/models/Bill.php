<?php

class Bill
{
    private $conn;
    private $table = 'bills';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create($data)
    {
        $query = 'INSERT INTO ' . $this->table . '
            (full_name, email, phone, address, note, payment_method)
            VALUES
            (:full_name, :email, :phone, :address, :note, :payment_method)
        ';
        $stmt = $this->conn->prepare($query);

        // Clean data
        $data['full_name'] = htmlspecialchars(strip_tags($data['full_name']));
        $data['email'] = htmlspecialchars(strip_tags($data['email']));
        $data['phone'] = htmlspecialchars(strip_tags($data['phone']));
        $data['address'] = htmlspecialchars(strip_tags($data['address']));
        $data['note'] = $data['note'] ? htmlspecialchars(strip_tags($data['note'])) : null;
        $data['payment_method'] = htmlspecialchars(strip_tags($data['payment_method']));

        // Bind values
        $stmt->bindParam(':full_name', $data['full_name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':note', $data['note']);
        $stmt->bindParam(':payment_method', $data['payment_method']);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

}
