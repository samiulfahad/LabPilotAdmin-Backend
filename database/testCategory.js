/** @format */

const { ObjectId } = require("mongodb");
const { getClient } = require("./connection");

const handleError = (e, methodName) => {
  console.log("Error Location: DB File (database > testCategory.js)");
  console.log(`Method Name: ${methodName}`);
  console.log(`Error Message: ${e.message}`);
  return { success: false, error: e.message };
};

const collectionName = "testCategory";

class TestCategory {
  // Function 1: Create category
  static async create(name) {
    try {
      const db = getClient();

      // Check if category name already exists
      const existing = await db.collection(collectionName).findOne({ name: name });

      if (existing) {
        return { duplicate: true };
      }

      const result = await db.collection(collectionName).insertOne({ name: name });
      return result.insertedId ? { success: true, categoryId: result.insertedId } : { success: false };
    } catch (e) {
      return handleError(e, "create");
    }
  }

  // Function 2: Get all categories
  static async findAll() {
    try {
      const db = getClient();
      const categoryList = await db.collection(collectionName).find({}).toArray();
      return { success: true, categoryList };
    } catch (e) {
      return handleError(e, "findAll");
    }
  }

  // Function 3: Update Category
  static async update(categoryId, name) {
    try {
      const db = getClient();
      categoryId = new ObjectId(categoryId);

      // Check for duplicates excluding current category
      const existing = await db.collection(collectionName).findOne({
        name: name,
      });

      if (existing) {
        return { duplicate: true };
      }

      const result = await db.collection(collectionName).updateOne({ _id: categoryId }, { $set: { name: name } });

      return result.modifiedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "update");
    }
  }

  // Function 4: Delete a category
  static async delete(categoryId) {
    try {
      categoryId = new ObjectId(categoryId);
      const db = getClient();

      const result = await db.collection(collectionName).deleteOne({ _id: categoryId });

      return result.deletedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "delete");
    }
  }

  // Function 5: Populate all categories with tests - USING AGGREGATION
  static async populateCategoryList() {
    try {
      const db = getClient();

      const pipeline = [
        // Lookup tests for each category
        {
          $lookup: {
            from: "test",
            localField: "_id",
            foreignField: "categoryId",
            as: "testList",
          },
        },

        // Project to format the output
        {
          $project: {
            categoryName: "$name",
            categoryId: "$_id",
            testList: {
              $map: {
                input: "$testList",
                as: "test",
                in: {
                  _id: "$$test._id",
                  name: "$$test.name",
                },
              },
            },
          },
        },

        // Sort by category name (optional)
        { $sort: { categoryName: 1 } },
      ];

      const populatedList = await db.collection(collectionName).aggregate(pipeline).toArray();
      return { success: true, populatedList };
    } catch (e) {
      return handleError(e, "populatedList");
    }
  }
}

module.exports = TestCategory;
