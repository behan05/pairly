const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // store hashed password only
    password: { type: String, required: true },

    // Lightweight role/permission system for admins
    role: {
        type: String,
        enum: ['admin', 'superadmin', 'moderator'],
        default: 'admin',
    },
    // Optional fine-grained permissions (strings like 'users:read', 'reports:delete')
    permissions: { type: [String], default: [] },

    // Account state & security
    isActive: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null },

    // Brute-force protection
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },

    // Audit fields
    lastLoginAt: { type: Date, default: null },
    lastPasswordChangedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Optional note about the admin (who/why created)
    notes: { type: String, default: '' },
}, { timestamps: true });

// Indexes
adminSchema.index({ email: 1 });

module.exports = mongoose.model('Admin', adminSchema);
