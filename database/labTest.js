/** @format */

const { ObjectId } = require("mongodb");
const { getClient } = require("./connection");
const getGMT = require("../helper/getGMT");

const handleError = (e, methodName) => {
  console.log("Error Location: DB File (database > test.js)");
  console.log(`Method Name: ${methodName}`);
  console.log(`Error Message: ${e.message}`);
  return null;
};

class Test {
  constructor(categoryName, systemId) {
    this.categoryName = categoryName;
    this.tests = [];
    this.createdBy = systemId;
    this.createdAt = getGMT();
  }

  static async createCategory(categoryName, systemId) {
    const category = {
      categoryName: categoryName,
      tests: [],
      createdBy: systemId,
      createdAt: getGMT(),
    };
    try {
      const db = getClient();

      // Check if category name already exists
      const existing = await db.collection("tests").findOne({
        categoryName: categoryName,
      });

      if (existing) {
        return { duplicate: true };
      }

      const result = await db.collection("tests").insertOne(category);
      return result.insertedId ? { success: true, categoryId: result.insertedId } : false;
    } catch (e) {
      return handleError(e, "createCategory");
    }
  }

  // Function 2: Get a category (with testlist)
  static async findTestsByCategoryId(_id) {
    try {
      const projection = {
        createdAt: 0,
        createdBy: 0,
        updatedAt: 0,
        updatedBy: 0,
      };
      const db = getClient();

      const category = await db.collection("tests").findOne(
        { _id: new ObjectId(_id) },
        { projection } // ✅ Correct: projection as second parameter
      );

      return category ? { success: true, category } : { success: false };
    } catch (e) {
      return handleError(e, "findCategory"); // ✅ Fixed method name
    }
  }

  // Function 3: Get all categories with tests
  static async findAllCategories() {
    try {
      const projection = {
        createdAt: 0,
        createdBy: 0,
        updatedAt: 0,
        updatedBy: 0,
      };
      const db = getClient();
      const categories = await db.collection("tests").find({}).project(projection).toArray();
      if (categories && categories.length >= 0) {
        return { success: true, categories };
      } else {
        return { success: false };
      }
    } catch (e) {
      return handleError(e, "findAllCategories");
    }
  }

  // Function 4: Update Category
  static async updateCategory(_id, categoryName, systemId) {
    try {
      const db = getClient();

      // Check if category name already exists (excluding the current category being updated)
      const existing = await db.collection("tests").findOne({
        categoryName: categoryName,
        _id: { $ne: new ObjectId(_id) }, // Exclude the current category from the check
      });

      if (existing) {
        return { duplicate: true };
      }

      const result = await db.collection("tests").updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            categoryName: categoryName,
            updatedBy: systemId,
            updatedAt: getGMT(),
          },
        }
      );

      return result.modifiedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "updateCategory");
    }
  }

  // Function 5: Delete a category (and all its tests)
  static async deleteCategory(_id) {
    try {
      const db = getClient();

      const result = await db.collection("tests").deleteOne({ _id: new ObjectId(_id) });

      return result.deletedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "deleteCategory");
    }
  }

  // Function 6: Create a test
  static async createTest(categoryId, name, systemId) {
    try {
      const db = getClient();

      // Check if test name already exists in this category
      const existing = await db.collection("tests").findOne({
        _id: new ObjectId(categoryId),
        "tests.name": name,
      });

      if (existing) {
        return { duplicate: true };
      }

      const test = {
        _id: new ObjectId(),
        name: name,
        defaultSchema: null,
        createdAt: getGMT(),
        createdBy: systemId,
      };

      // Use updateOne instead
      const result = await db.collection("tests").updateOne(
        { _id: new ObjectId(categoryId) },
        {
          $push: {
            tests: test,
          },
        }
      );

      if (result.modifiedCount === 0) {
        return { success: false, message: "Category not found or test not added" };
      }

      // Return the test object we created
      return {
        success: true,
        test: test, // This is the inserted test
      };
    } catch (e) {
      return handleError(e, "createTest");
    }
  }

  // Function 7: Update test
  static async updateTest(categoryId, testId, newName, defaultSchema, systemId) {
    try {
      const db = getClient();

      // Check if test name already exists in this category (excluding the current test)
      const existing = await db.collection("tests").findOne({
        _id: new ObjectId(categoryId),
        tests: {
          $elemMatch: {
            name: newName,
            _id: { $ne: new ObjectId(testId) },
          },
        },
      });

      if (existing) {
        return { duplicate: true };
      }

      const result = await db.collection("tests").findOneAndUpdate(
        {
          _id: new ObjectId(categoryId),
          "tests._id": new ObjectId(testId),
        },
        {
          $set: {
            "tests.$.name": newName,
            "tests.$.defaultSchema": defaultSchema,
            "tests.$.updatedAt": getGMT(),
            "tests.$.updatedBy": systemId,
            updatedAt: getGMT(),
            updatedBy: systemId,
          },
        },
        {
          returnDocument: "after", // Returns the updated document
          includeResultMetadata: true, // Includes operation metadata
        }
      );

      if (!result.value) {
        return { success: false, message: "Category/Test not found" };
      }

      // Return the updated category document with the modified tests
      return { success: true, test: result.value };
    } catch (e) {
      return handleError(e, "updateTest");
    }
  }

  // Function 8: Delete Test
  static async deleteTest(categoryId, testId, systemId) {
    try {
      const db = getClient();

      // Remove the test
      const result = await db.collection("tests").updateOne(
        {
          _id: new ObjectId(categoryId),
          "tests._id": new ObjectId(testId), // Added test existence check
        },
        {
          $pull: {
            tests: { _id: new ObjectId(testId) },
          },
          $set: {
            updatedAt: getGMT(),
            updatedBy: systemId,
          },
        }
      );
      return result.modifiedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "deleteTest");
    }
  }

  static async setTestSchema(categoryId, testId, schemaId, systemId) {
    try {
      const db = getClient();

      // Update the specific test within the tests array
      const result = await db.collection("tests").updateOne(
        {
          _id: new ObjectId(categoryId),
          "tests._id": new ObjectId(testId),
        },
        {
          $set: {
            "tests.$.defaultSchema": schemaId,
            "tests.$.defaultSchemaAddedBy": systemId,
            "tests.$.defaultSchemaAddedAt": getGMT(),
            updatedAt: getGMT(),
            updatedBy: systemId,
          },
        }
      );

      return result.modifiedCount > 0 ? { success: true } : { success: false };
    } catch (e) {
      return handleError(e, "setTestSchema");
    }
  }
}

module.exports = Test;
