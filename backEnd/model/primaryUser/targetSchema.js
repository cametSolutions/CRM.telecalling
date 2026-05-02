import mongoose from 'mongoose';

const { Schema } = mongoose;

// =====================================================
// 1. TARGET CATEGORY SCHEMA
// =====================================================
const TargetCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: String,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

TargetCategorySchema.index({ isActive: 1 });

// =====================================================
// 2. ALLOCATION SCHEMA
// =====================================================
const AllocationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: String,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

AllocationSchema.index({ isActive: 1 });

// =====================================================
// 3. USER SCHEMA
// =====================================================
const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

UserSchema.index({ email: 1 });
UserSchema.index({ isActive: 1 });

// =====================================================
// 4. TARGET SLAB SUB-SCHEMA
// =====================================================
const TargetSlabSchema = new Schema(
    {
        slabOrder: {
            type: Number,
            required: true
        },
        fromValue: {
            type: Number,
            required: true,
            min: 0
        },
        toValue: {
            type: Number,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.fromValue;
                },
                message: 'toValue must be greater than fromValue'
            }
        }
    },
    { _id: false }
);

// =====================================================
// 5. USER TARGET SUB-SCHEMA
// =====================================================
const UserTargetSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        slabs: [TargetSlabSchema]
    },
    { _id: false }
);

// =====================================================
// 6. MONTHLY TARGET SUB-SCHEMA
// =====================================================
const MonthlyTargetSchema = new Schema(
    {
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },
        year: {
            type: Number,
            required: true
        },
        userTargets: [UserTargetSchema]
    },
    { _id: true }
);

// =====================================================
// 7. ALLOCATION VALUE SUB-SCHEMA
// =====================================================
const AllocationValueSchema = new Schema(
    {
        allocationId: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            required: true
        },
        allocationName: String,
        value: {
            type: Number,
            required: true,
            min: 0
        },
        mode: { type: String, enum: ["percentage", "amount"] }
    },
    { _id: false }
);

// =====================================================
// 8. MAIN TARGET CONFIGURATION SCHEMA
// =====================================================
const TargetConfigurationSchema = new Schema(
    {
        periodName: {
            type: String,
            required: true,
            trim: true
        },
year:{type:Number},
        branch: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.startDate;
                },
                message: 'endDate must be after startDate'
            }
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        categoryName: String,
        measurementType: {
            type: String,
            enum: ['quantity', 'amount'],
            required: true
        },
        allocationValues: [AllocationValueSchema],
        monthlyTargets: [MonthlyTargetSchema],
        status: {
            type: String,
            enum: ['draft', 'active', 'completed', 'cancelled'],
            default: 'draft'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

TargetConfigurationSchema.index({ startDate: 1, endDate: 1 });
TargetConfigurationSchema.index({ categoryId: 1, status: 1 });
TargetConfigurationSchema.index({ 'monthlyTargets.year': 1, 'monthlyTargets.month': 1 });
TargetConfigurationSchema.index({ 'monthlyTargets.userTargets.userId': 1 });

// =====================================================
// 9. TARGET ACHIEVEMENT SCHEMA
// =====================================================
const TargetAchievementSchema = new Schema(
    {
        targetConfigId: {
            type: Schema.Types.ObjectId,
            ref: 'TargetConfiguration',
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },
        year: {
            type: Number,
            required: true
        },
        allocationId: {
            type: Schema.Types.ObjectId,
            ref: 'Allocation',
            required: true
        },
        achievedValue: {
            type: Number,
            default: 0,
            min: 0
        },
        achievementDate: {
            type: Date,
            default: Date.now
        },
        slabMatched: {
            slabOrder: Number,
            fromValue: Number,
            toValue: Number
        }
    },
    {
        timestamps: true
    }
);

TargetAchievementSchema.index({ targetConfigId: 1, userId: 1, month: 1, year: 1 });
TargetAchievementSchema.index({ achievementDate: 1 });
TargetAchievementSchema.index({ userId: 1, year: 1, month: 1 });

// =====================================================
// MODELS
// =====================================================
const TargetCategory = mongoose.model('TargetCategory', TargetCategorySchema);
const Allocation = mongoose.model('Allocation', AllocationSchema);
const User = mongoose.model('User', UserSchema);
const TargetConfiguration = mongoose.model(
    'TargetConfiguration',
    TargetConfigurationSchema
);
const TargetAchievement = mongoose.model(
    'TargetAchievement',
    TargetAchievementSchema
);

// =====================================================
// EXPORTS
// =====================================================
export {
    TargetCategory,
    Allocation,
    User,
    TargetConfiguration,
    TargetAchievement
};