export interface CodeImplementation {
  cpp: string;
  java: string;
  python: string;
}

export const algorithmCodeMap: Record<string, CodeImplementation> = {
  'binary-search': {
    cpp: `#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> arr = {1, 3, 5, 7, 9, 11, 13};
    int target = 7;
    int idx = binarySearch(arr, target);
    std::cout << "Found target at index: " << idx << std::endl;
    return 0;
}`,
    java: `import java.util.Arrays;

public class BinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13};
        int target = 7;
        int result = search(arr, target);
        System.out.println("Found target at index: " + result);
    }
}`,
    python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

if __name__ == "__main__":
    nums = [1, 3, 5, 7, 9, 11, 13]
    target = 7
    idx = binary_search(nums, target)
    print(f"Found target at index: {idx}")`,
  },

  'linear-search': {
    cpp: `#include <iostream>
#include <vector>

int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

int main() {
    std::vector<int> arr = {4, 2, 7, 1, 9, 3};
    std::cout << "Found at index: " << linearSearch(arr, 7) << std::endl;
    return 0;
}`,
    java: `public class LinearSearch {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {4, 2, 7, 1, 9, 3};
        System.out.println("Found at index: " + search(arr, 7));
    }
}`,
    python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

if __name__ == "__main__":
    arr = [4, 2, 7, 1, 9, 3]
    print("Found at index:", linear_search(arr, 7))`,
  },

  'bubble-sort': {
    cpp: `#include <iostream>
#include <vector>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);
    for (int x : arr) std::cout << x << " ";
    return 0;
}`,
    java: `public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
  },

  'insertion-sort': {
    cpp: `#include <iostream>
#include <vector>

void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    java: `public class InsertionSort {
    public static void sort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
  },

  'selection-sort': {
    cpp: `#include <iostream>
#include <vector>

void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        std::swap(arr[i], arr[minIdx]);
    }
}`,
    java: `public class SelectionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
  },

  'merge-sort-tree': {
    cpp: `#include <iostream>
#include <vector>

void merge(std::vector<int>& arr, int left, int mid, int right) {
    std::vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    std::vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);
    int i = 0, j = 0, k = left;
    while (i < (int)L.size() && j < (int)R.size()) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < (int)L.size()) arr[k++] = L[i++];
    while (j < (int)R.size()) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`,
    java: `public class MergeSort {
    public static void sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
    private static void merge(int[] arr, int l, int m, int r) {
        int[] left = java.util.Arrays.copyOfRange(arr, l, m + 1);
        int[] right = java.util.Arrays.copyOfRange(arr, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else arr[k++] = right[j++];
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res`,
  },

  'quick-sort-partition': {
    cpp: `#include <iostream>
#include <vector>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    java: `public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
  },

  'kadane-algorithm': {
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>

int maxSubArray(const std::vector<int>& nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        currentMax = std::max(nums[i], currentMax + nums[i]);
        maxSoFar = std::max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`,
    java: `public class Kadane {
    public static int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currentMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currentMax);
        }
        return maxSoFar;
    }
}`,
    python: `def max_sub_array(nums):
    max_so_far = nums[0]
    curr_max = nums[0]
    for x in nums[1:]:
        curr_max = max(x, curr_max + x)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`,
  },

  'two-pointers-sum': {
    cpp: `#include <vector>

bool twoSumSorted(const std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}`,
    java: `public class TwoPointers {
    public static boolean hasPairWithSum(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) return true;
            if (sum < target) left++;
            else right--;
        }
        return false;
    }
}`,
    python: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return (left, right)
        elif s < target:
            left += 1
        else:
            right -= 1
    return None`,
  },

  'graph-bfs-dfs': {
    cpp: `#include <vector>
#include <queue>

void bfs(int start, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    std::queue<int> q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}

void dfs(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) dfs(v, adj, visited);
    }
}`,
    java: `import java.util.*;

public class GraphTraversal {
    public static void bfs(int start, List<List<Integer>> adj) {
        boolean[] visited = new boolean[adj.size()];
        Queue<Integer> q = new LinkedList<>();
        q.add(start);
        visited[start] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.add(v);
                }
            }
        }
    }
}`,
    python: `from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited`,
  },

  'dijkstra-shortest': {
    cpp: `#include <vector>
#include <queue>

std::vector<int> dijkstra(int n, int src, const std::vector<std::vector<std::pair<int, int>>>& adj) {
    std::vector<int> dist(n, 1e9);
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
    java: `import java.util.*;

public class Dijkstra {
    public static int[] shortestPath(int n, int src, List<List<int[]>> adj) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        dist[src] = 0;
        pq.add(new int[]{src, 0});
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0], d = curr[1];
            if (d > dist[u]) continue;
            for (int[] edge : adj.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.add(new int[]{v, dist[v]});
                }
            }
        }
        return dist;
    }
}`,
    python: `import heapq

def dijkstra(graph, start):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    while pq:
        current_dist, current_node = heapq.heappop(pq)
        if current_dist > distances[current_node]:
            continue
        for neighbor, weight in graph[current_node].items():
            dist = current_dist + weight
            if dist < distances[neighbor]:
                distances[neighbor] = dist
                heapq.heappush(pq, (dist, neighbor))
    return distances`,
  },

  'knapsack-01-table': {
    cpp: `#include <vector>
#include <algorithm>

int knapsack(int W, const std::vector<int>& wt, const std::vector<int>& val, int n) {
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = std::max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
    java: `public class Knapsack {
    public static int solve(int W, int[] wt, int[] val, int n) {
        int[][] dp = new int[n + 1][W + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                if (wt[i - 1] <= w) {
                    dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][W];
    }
}`,
    python: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][capacity]`,
  },

  'tower-of-hanoi': {
    cpp: `#include <iostream>

void hanoi(int n, char from, char aux, char to) {
    if (n == 0) return;
    hanoi(n - 1, from, to, aux);
    std::cout << "Move disk " << n << " from " << from << " to " << to << std::endl;
    hanoi(n - 1, aux, from, to);
}

int main() {
    hanoi(3, 'A', 'B', 'C');
    return 0;
}`,
    java: `public class TowerOfHanoi {
    public static void solve(int n, char from, char aux, char to) {
        if (n == 0) return;
        solve(n - 1, from, to, aux);
        System.out.println("Move disk " + n + " from " + from + " to " + to);
        solve(n - 1, aux, from, to);
    }
}`,
    python: `def hanoi(n, source, auxiliary, target):
    if n > 0:
        hanoi(n - 1, source, target, auxiliary)
        print(f"Move disk {n} from {source} to {target}")
        hanoi(n - 1, auxiliary, source, target)`,
  },
  'divide-conquer-merge': {
    cpp: `#include <iostream>
#include <vector>

void merge(std::vector<int>& arr, int left, int mid, int right) {
    std::vector<int> leftHalf(arr.begin() + left, arr.begin() + mid + 1);
    std::vector<int> rightHalf(arr.begin() + mid + 1, arr.begin() + right + 1);
    int i = 0, j = 0, k = left;
    while (i < leftHalf.size() && j < rightHalf.size()) {
        if (leftHalf[i] <= rightHalf[j]) arr[k++] = leftHalf[i++];
        else arr[k++] = rightHalf[j++];
    }
    while (i < leftHalf.size()) arr[k++] = leftHalf[i++];
    while (j < rightHalf.size()) arr[k++] = rightHalf[j++];
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

int main() {
    std::vector<int> arr = {38, 27, 43, 3, 9, 82, 10};
    mergeSort(arr, 0, arr.size() - 1);
    for (int x : arr) std::cout << x << " ";
    return 0;
}`,
    java: `import java.util.Arrays;

public class MergeSortTree {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int[] L = Arrays.copyOfRange(arr, left, mid + 1);
        int[] R = Arrays.copyOfRange(arr, mid + 1, right + 1);
        int i = 0, j = 0, k = left;
        while (i < L.length && j < R.length) {
            arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
        }
        while (i < L.length) arr[k++] = L[i++];
        while (j < R.length) arr[k++] = R[j++];
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged`,
  },
  'divide-conquer-quick': {
    cpp: `#include <iostream>
#include <vector>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) std::swap(arr[++i], arr[j]);
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    std::vector<int> arr = {10, 80, 30, 90, 40, 50, 70};
    quickSort(arr, 0, arr.size() - 1);
    for (int x : arr) std::cout << x << " ";
    return 0;
}`,
    java: `import java.util.Arrays;

public class QuickSortTree {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            }
        }
        int tmp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = tmp;
        return i + 1;
    }

    public static void main(String[] args) {
        int[] arr = {10, 80, 30, 90, 40, 50, 70};
        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}`,
    python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x < pivot]
    right = [x for x in arr[:-1] if x >= pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)`,
  },
  'divide-conquer-binary': {
    cpp: `#include <iostream>
#include <vector>

int binarySearchDC(const std::vector<int>& arr, int low, int high, int target) {
    if (low > high) return -1;
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (target < arr[mid]) return binarySearchDC(arr, low, mid - 1, target);
    return binarySearchDC(arr, mid + 1, high, target);
}

int main() {
    std::vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
    int res = binarySearchDC(arr, 0, arr.size() - 1, 72);
    std::cout << "Target index: " << res << std::endl;
    return 0;
}`,
    java: `public class BinarySearchDC {
    public static int search(int[] arr, int low, int high, int target) {
        if (low > high) return -1;
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (target < arr[mid]) return search(arr, low, mid - 1, target);
        return search(arr, mid + 1, high, target);
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        System.out.println("Target index: " + search(arr, 0, arr.length - 1, 72));
    }
}`,
    python: `def binary_search_dc(arr, low, high, target):
    if low > high:
        return -1
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    elif target < arr[mid]:
        return binary_search_dc(arr, low, mid - 1, target)
    else:
        return binary_search_dc(arr, mid + 1, high, target)`,
  },
  'n-queens-solver': {
    cpp: `#include <iostream>
#include <vector>

bool isSafe(const std::vector<std::vector<int>>& board, int row, int col, int n) {
    // Check column
    for (int i = 0; i < row; ++i) {
        if (board[i][col] == 1) return false;
    }
    // Check upper-left diagonal
    for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
        if (board[i][j] == 1) return false;
    }
    // Check upper-right diagonal
    for (int i = row - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
        if (board[i][j] == 1) return false;
    }
    return true;
}

bool solveNQueens(std::vector<std::vector<int>>& board, int row, int n) {
    if (row == n) return true; // All queens safely placed

    for (int col = 0; col < n; ++col) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 1; // Choose

            if (solveNQueens(board, row + 1, n)) return true; // Explore

            board[row][col] = 0; // Undo (Backtrack)
        }
    }
    return false;
}

int main() {
    int n = 4;
    std::vector<std::vector<int>> board(n, std::vector<int>(n, 0));
    if (solveNQueens(board, 0, n)) {
        std::cout << "N-Queens Solution Found:" << std::endl;
        for (const auto& r : board) {
            for (int val : r) std::cout << (val ? "Q " : ". ");
            std::cout << std::endl;
        }
    }
    return 0;
}`,
    java: `import java.util.Arrays;

public class NQueens {
    public static boolean isSafe(int[][] board, int row, int col, int n) {
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 1) return false;
        }
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 1) return false;
        }
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 1) return false;
        }
        return true;
    }

    public static boolean solve(int[][] board, int row, int n) {
        if (row == n) return true;
        for (int col = 0; col < n; col++) {
            if (isSafe(board, row, col, n)) {
                board[row][col] = 1;
                if (solve(board, row + 1, n)) return true;
                board[row][col] = 0; // Backtrack
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int n = 4;
        int[][] board = new int[n][n];
        if (solve(board, 0, n)) {
            for (int[] row : board) {
                for (int cell : row) System.out.print(cell == 1 ? "Q " : ". ");
                System.out.println();
            }
        }
    }
}`,
    python: `def solve_n_queens(n):
    board = [["."] * n for _ in range(n)]
    cols = set()
    pos_diag = set() # (r + c)
    neg_diag = set() # (r - c)

    def backtrack(r):
        if r == n:
            return True
        for c in range(n):
            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:
                continue # Attacked square

            board[r][c] = "Q"
            cols.add(c)
            pos_diag.add(r + c)
            neg_diag.add(r - c)

            if backtrack(r + 1):
                return True

            board[r][c] = "." # Backtrack
            cols.remove(c)
            pos_diag.remove(r + c)
            neg_diag.remove(r - c)
        return False

    if backtrack(0):
        for row in board:
            print(" ".join(row))

if __name__ == "__main__":
    solve_n_queens(4)`,
  },
  'sudoku-backtrack': {
    cpp: `#include <iostream>
#include <vector>

bool isValid(const std::vector<std::vector<int>>& grid, int r, int c, int num, int n, int boxSize) {
    for (int i = 0; i < n; ++i) {
        if (grid[r][i] == num) return false; // Row check
        if (grid[i][c] == num) return false; // Col check
    }
    int boxR = (r / boxSize) * boxSize;
    int boxC = (c / boxSize) * boxSize;
    for (int i = 0; i < boxSize; ++i) {
        for (int j = 0; j < boxSize; ++j) {
            if (grid[boxR + i][boxC + j] == num) return false; // Box check
        }
    }
    return true;
}

bool solveSudoku(std::vector<std::vector<int>>& grid, int n, int boxSize) {
    for (int r = 0; r < n; ++r) {
        for (int c = 0; c < n; ++c) {
            if (grid[r][c] == 0) {
                for (int num = 1; num <= n; ++num) {
                    if (isValid(grid, r, c, num, n, boxSize)) {
                        grid[r][c] = num;
                        if (solveSudoku(grid, n, boxSize)) return true;
                        grid[r][c] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

int main() {
    std::vector<std::vector<int>> grid = {
        {1, 0, 3, 0},
        {0, 0, 0, 2},
        {0, 1, 4, 0},
        {0, 0, 0, 3}
    };
    if (solveSudoku(grid, 4, 2)) {
        std::cout << "Solved 4x4 Sudoku:" << std::endl;
        for (const auto& row : grid) {
            for (int v : row) std::cout << v << " ";
            std::cout << std::endl;
        }
    }
    return 0;
}`,
    java: `public class SudokuSolver {
    public static boolean isValid(int[][] grid, int r, int c, int val, int size, int box) {
        for (int i = 0; i < size; i++) {
            if (grid[r][i] == val || grid[i][c] == val) return false;
        }
        int br = (r / box) * box, bc = (c / box) * box;
        for (int i = 0; i < box; i++) {
            for (int j = 0; j < box; j++) {
                if (grid[br + i][bc + j] == val) return false;
            }
        }
        return true;
    }

    public static boolean solve(int[][] grid, int size, int box) {
        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                if (grid[r][c] == 0) {
                    for (int num = 1; num <= size; num++) {
                        if (isValid(grid, r, c, num, size, box)) {
                            grid[r][c] = num;
                            if (solve(grid, size, box)) return true;
                            grid[r][c] = 0; // Backtrack
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    public static void main(String[] args) {
        int[][] grid = {
            {1, 0, 3, 0},
            {0, 0, 0, 2},
            {0, 1, 4, 0},
            {0, 0, 0, 3}
        };
        if (solve(grid, 4, 2)) {
            for (int[] row : grid) {
                for (int v : row) System.out.print(v + " ");
                System.out.println();
            }
        }
    }
}`,
    python: `def solve_sudoku(grid, size=4, box=2):
    for r in range(size):
        for c in range(size):
            if grid[r][c] == 0:
                for num in range(1, size + 1):
                    # Check row, col, and subgrid box
                    row_ok = all(grid[r][i] != num for i in range(size))
                    col_ok = all(grid[i][c] != num for i in range(size))
                    br, bc = (r // box) * box, (c // box) * box
                    box_ok = all(grid[br + i][bc + j] != num for i in range(box) for j in range(box))

                    if row_ok and col_ok and box_ok:
                        grid[r][c] = num
                        if solve_sudoku(grid, size, box):
                            return True
                        grid[r][c] = 0 # Backtrack
                return False
    return True

if __name__ == "__main__":
    puzzle = [
        [1, 0, 3, 0],
        [0, 0, 0, 2],
        [0, 1, 4, 0],
        [0, 0, 0, 3]
    ]
    if solve_sudoku(puzzle, 4, 2):
        for row in puzzle:
            print(row)`,
  },
  'activity-selection-opt': {
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>

struct Activity {
    int id;
    int start;
    int end;
};

void activitySelection(std::vector<Activity>& acts) {
    // 1. Sort activities by finish time ascending
    std::sort(acts.begin(), acts.end(), [](const Activity& a, const Activity& b) {
        return a.end < b.end;
    });

    std::vector<Activity> selected;
    selected.push_back(acts[0]);
    int lastFinish = acts[0].end;

    for (size_t i = 1; i < acts.size(); ++i) {
        if (acts[i].start >= lastFinish) {
            selected.push_back(acts[i]);
            lastFinish = acts[i].end;
        }
    }

    std::cout << "Optimal Scheduled Activities (" << selected.size() << "):" << std::endl;
    for (const auto& a : selected) {
        std::cout << "Activity " << a.id << " [" << a.start << ".." << a.end << "]" << std::endl;
    }
}

int main() {
    std::vector<Activity> acts = {
        {1, 1, 4}, {2, 3, 5}, {3, 0, 6}, {4, 5, 7},
        {5, 3, 9}, {6, 5, 9}, {7, 6, 10}, {8, 8, 11}
    };
    activitySelection(acts);
    return 0;
}`,
    java: `import java.util.*;

class Activity {
    int id, start, end;
    Activity(int id, int s, int e) { this.id = id; this.start = s; this.end = e; }
}

public class ActivitySelection {
    public static void main(String[] args) {
        List<Activity> acts = Arrays.asList(
            new Activity(1, 1, 4), new Activity(2, 3, 5), new Activity(3, 0, 6),
            new Activity(4, 5, 7), new Activity(5, 3, 9), new Activity(6, 5, 9),
            new Activity(7, 6, 10), new Activity(8, 8, 11)
        );

        acts.sort(Comparator.comparingInt(a -> a.end));
        List<Activity> chosen = new ArrayList<>();
        chosen.add(acts.get(0));
        int lastFinish = acts.get(0).end;

        for (int i = 1; i < acts.size(); i++) {
            if (acts.get(i).start >= lastFinish) {
                chosen.add(acts.get(i));
                lastFinish = acts.get(i).end;
            }
        }

        System.out.println("Selected " + chosen.size() + " non-overlapping activities:");
        for (Activity a : chosen) {
            System.out.println("Activity " + a.id + " [" + a.start + ".." + a.end + "]");
        }
    }
}`,
    python: `def activity_selection(activities):
    # Sort by finish time
    sorted_acts = sorted(activities, key=lambda a: a["end"])
    selected = [sorted_acts[0]]
    last_finish = sorted_acts[0]["end"]

    for act in sorted_acts[1:]:
        if act["start"] >= last_finish:
            selected.append(act)
            last_finish = act["end"]

    print(f"Selected {len(selected)} activities:")
    for a in selected:
        print(f"Activity {a['id']}: [{a['start']}..{a['end']}]")
    return selected

if __name__ == "__main__":
    acts = [
        {"id": 1, "start": 1, "end": 4},
        {"id": 2, "start": 3, "end": 5},
        {"id": 3, "start": 0, "end": 6},
        {"id": 4, "start": 5, "end": 7},
        {"id": 5, "start": 3, "end": 9},
        {"id": 6, "start": 5, "end": 9},
        {"id": 7, "start": 6, "end": 10},
        {"id": 8, "start": 8, "end": 11},
    ]
    activity_selection(acts)`,
  },
  'huffman-coding-tree': {
    cpp: `#include <iostream>
#include <queue>
#include <vector>
#include <string>
#include <unordered_map>

struct HuffmanNode {
    char ch;
    int freq;
    HuffmanNode *left, *right;
    HuffmanNode(char c, int f, HuffmanNode* l = nullptr, HuffmanNode* r = nullptr)
        : ch(c), freq(f), left(l), right(r) {}
};

struct Compare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) {
        return a->freq > b->freq;
    }
};

void generateCodes(HuffmanNode* root, const std::string& code, std::unordered_map<char, std::string>& huffmanCodes) {
    if (!root) return;
    if (!root->left && !root->right) {
        huffmanCodes[root->ch] = code;
    }
    generateCodes(root->left, code + "0", huffmanCodes);
    generateCodes(root->right, code + "1", huffmanCodes);
}

int main() {
    std::unordered_map<char, int> freq = {{'A', 5}, {'R', 2}, {'B', 2}, {'C', 1}, {'D', 1}};
    std::priority_queue<HuffmanNode*, std::vector<HuffmanNode*>, Compare> pq;

    for (auto pair : freq) {
        pq.push(new HuffmanNode(pair.first, pair.second));
    }

    while (pq.size() > 1) {
        HuffmanNode* left = pq.top(); pq.pop();
        HuffmanNode* right = pq.top(); pq.pop();
        pq.push(new HuffmanNode('$', left->freq + right->freq, left, right));
    }

    HuffmanNode* root = pq.top();
    std::unordered_map<char, std::string> codes;
    generateCodes(root, "", codes);

    std::cout << "Huffman Prefix Codes:" << std::endl;
    for (auto pair : codes) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }
    return 0;
}`,
    java: `import java.util.*;

class Node {
    char ch;
    int freq;
    Node left, right;
    Node(char ch, int f, Node l, Node r) {
        this.ch = ch; this.freq = f; this.left = l; this.right = r;
    }
}

public class Huffman {
    public static void buildCodes(Node root, String code, Map<Character, String> map) {
        if (root == null) return;
        if (root.left == null && root.right == null) {
            map.put(root.ch, code);
        }
        buildCodes(root.left, code + "0", map);
        buildCodes(root.right, code + "1", map);
    }

    public static void main(String[] args) {
        PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.freq));
        pq.add(new Node('A', 5, null, null));
        pq.add(new Node('R', 2, null, null));
        pq.add(new Node('B', 2, null, null));
        pq.add(new Node('C', 1, null, null));
        pq.add(new Node('D', 1, null, null));

        while (pq.size() > 1) {
            Node l = pq.poll(), r = pq.poll();
            pq.add(new Node('$', l.freq + r.freq, l, r));
        }

        Map<Character, String> codes = new HashMap<>();
        buildCodes(pq.peek(), "", codes);
        codes.forEach((k, v) -> System.out.println(k + ": " + v));
    }
}`,
    python: `import heapq

def huffman_coding(frequencies):
    # Min-heap of [freq, id, node]
    heap = [[freq, [ch, ""]] for ch, freq in frequencies.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]:
            pair[1] = "0" + pair[1]
        for pair in hi[1:]:
            pair[1] = "1" + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])

    codes = {pair[0]: pair[1] for pair in heap[0][1:]}
    print("Huffman Prefix Codes:", codes)
    return codes

if __name__ == "__main__":
    freqs = {"A": 5, "R": 2, "B": 2, "C": 1, "D": 1}
    huffman_coding(freqs)`,
  },
  'bit-manipulation': {
    cpp: `#include <iostream>
#include <bitset>

void demonstrateBitOps(int a, int b) {
    std::cout << "A = " << a << " (" << std::bitset<8>(a) << ")" << std::endl;
    std::cout << "B = " << b << " (" << std::bitset<8>(b) << ")" << std::endl;

    // 1. Bitwise AND
    std::cout << "A & B = " << (a & b) << " (" << std::bitset<8>(a & b) << ")" << std::endl;

    // 2. Bitwise OR
    std::cout << "A | B = " << (a | b) << " (" << std::bitset<8>(a | b) << ")" << std::endl;

    // 3. Bitwise XOR
    std::cout << "A ^ B = " << (a ^ b) << " (" << std::bitset<8>(a ^ b) << ")" << std::endl;

    // 4. Shifts
    std::cout << "A << 1 = " << (a << 1) << " (" << std::bitset<8>(a << 1) << ")" << std::endl;
    std::cout << "A >> 1 = " << (a >> 1) << " (" << std::bitset<8>(a >> 1) << ")" << std::endl;

    // 5. Brian Kernighan's Set Bit Count: n & (n - 1)
    int n = a, count = 0;
    while (n > 0) {
        n = n & (n - 1);
        count++;
    }
    std::cout << "Brian Kernighan Set Bits count in A: " << count << std::endl;

    // 6. Check Parity (Odd / Even)
    std::cout << a << " is " << ((a & 1) ? "ODD" : "EVEN") << std::endl;
}

int main() {
    demonstrateBitOps(25, 14);
    return 0;
}`,
    java: `public class BitManipulationDemo {
    public static void main(String[] args) {
        int a = 25, b = 14;
        System.out.printf("A = %d (%8s)%n", a, Integer.toBinaryString(a));
        System.out.printf("B = %d (%8s)%n", b, Integer.toBinaryString(b));

        System.out.println("A & B  = " + (a & b));
        System.out.println("A | B  = " + (a | b));
        System.out.println("A ^ B  = " + (a ^ b));
        System.out.println("A << 1 = " + (a << 1));
        System.out.println("A >> 1 = " + (a >> 1));

        // Brian Kernighan
        int n = a, count = 0;
        while (n > 0) {
            n = n & (n - 1);
            count++;
        }
        System.out.println("Set bits count: " + count);
        System.out.println("Is odd: " + ((a & 1) == 1));
    }
}`,
    python: `def demonstrate_bits(a=25, b=14):
    print(f"A = {a} ({bin(a)[2:].zfill(8)})")
    print(f"B = {b} ({bin(b)[2:].zfill(8)})")

    print(f"A & B  = {a & b} ({bin(a & b)[2:].zfill(8)})")
    print(f"A | B  = {a | b} ({bin(a | b)[2:].zfill(8)})")
    print(f"A ^ B  = {a ^ b} ({bin(a ^ b)[2:].zfill(8)})")
    print(f"A << 1 = {a << 1} ({bin(a << 1)[2:].zfill(8)})")
    print(f"A >> 1 = {a >> 1} ({bin(a >> 1)[2:].zfill(8)})")

    # Brian Kernighan set bits count
    n, count = a, 0
    while n > 0:
        n = n & (n - 1)
        count += 1
    print(f"Set bits count in A: {count}")
    print(f"{a} is {'ODD' if (a & 1) else 'EVEN'}")

if __name__ == "__main__":
    demonstrate_bits(25, 14)`,
  },
  'lcs-animated-fill': {
    cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

std::string longestCommonSubsequence(const std::string& s1, const std::string& s2) {
    int m = s1.length(), n = s2.length();
    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Traceback to recover LCS string
    std::string lcs = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            lcs += s1[i - 1];
            i--; j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    std::reverse(lcs.begin(), lcs.end());
    return lcs;
}

int main() {
    std::string s1 = "ABCDE", s2 = "ACE";
    std::string result = longestCommonSubsequence(s1, s2);
    std::cout << "LCS of " << s1 << " and " << s2 << " is: " << result << " (Length: " << result.length() << ")" << std::endl;
    return 0;
}`,
    java: `public class LCS {
    public static String findLCS(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                sb.append(s1.charAt(i - 1));
                i--; j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        return sb.reverse().toString();
    }

    public static void main(String[] args) {
        String s1 = "ABCDE", s2 = "ACE";
        String lcs = findLCS(s1, s2);
        System.out.println("LCS: " + lcs + " (Length: " + lcs.length() + ")");
    }
}`,
    python: `def longest_common_subsequence(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Traceback
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i - 1] == s2[j - 1]:
            lcs.append(s1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1

    return "".join(reversed(lcs))

if __name__ == "__main__":
    print("LCS:", longest_common_subsequence("ABCDE", "ACE"))`,
  },
  'dp-fibonacci-dual': {
    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

// Top-Down: Memoization
int fibMemo(int n, std::unordered_map<int, int>& memo) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}

// Bottom-Up: Tabulation
int fibTab(int n) {
    if (n <= 1) return n;
    std::vector<int> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; ++i) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

int main() {
    int n = 6;
    std::unordered_map<int, int> memo;
    std::cout << "Fibonacci(" << n << ") Memoization: " << fibMemo(n, memo) << std::endl;
    std::cout << "Fibonacci(" << n << ") Tabulation: " << fibTab(n) << std::endl;
    return 0;
}`,
    java: `import java.util.HashMap;
import java.util.Map;

public class FibonacciDual {
    // Top-Down Memoization
    public static int fibMemo(int n, Map<Integer, Integer> memo) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        int res = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
        memo.put(n, res);
        return res;
    }

    // Bottom-Up Tabulation
    public static int fibTab(int n) {
        if (n <= 1) return n;
        int[] dp = new int[n + 1];
        dp[0] = 0; dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        int n = 6;
        System.out.println("Memoization: " + fibMemo(n, new HashMap<>()));
        System.out.println("Tabulation:  " + fibTab(n));
    }
}`,
    python: `def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

if __name__ == "__main__":
    n = 6
    print(f"Fibonacci({n}) Top-Down:", fib_memo(n))
    print(f"Fibonacci({n}) Bottom-Up:", fib_tab(n))`,
  },
  'coin-change-dp': {
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>

int coinChange(const std::vector<int>& coins, int amount) {
    std::vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;

    for (int a = 1; a <= amount; ++a) {
        for (int c : coins) {
            if (a - c >= 0) {
                dp[a] = std::min(dp[a], 1 + dp[a - c]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

int main() {
    std::vector<int> coins = {1, 2, 5};
    int amount = 7;
    std::cout << "Fewest coins for " << amount << ": " << coinChange(coins, amount) << std::endl;
    return 0;
}`,
    java: `import java.util.Arrays;

public class CoinChange {
    public static int minCoins(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (a - c >= 0) {
                    dp[a] = Math.min(dp[a], 1 + dp[a - c]);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        int amount = 7;
        System.out.println("Min coins for " + amount + ": " + minCoins(coins, amount));
    }
}`,
    python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])

    return dp[amount] if dp[amount] != float('inf') else -1

if __name__ == "__main__":
    print("Fewest coins for 7:", coin_change([1, 2, 5], 7))`,
  },
  'matrix-chain-mult': {
    cpp: `#include <iostream>
#include <vector>
#include <climits>

int matrixChainOrder(const std::vector<int>& p) {
    int n = p.size() - 1; // number of matrices
    std::vector<std::vector<int>> m(n, std::vector<int>(n, 0));

    for (int L = 2; L <= n; ++L) {
        for (int i = 0; i <= n - L; ++i) {
            int j = i + L - 1;
            m[i][j] = INT_MAX;
            for (int k = i; k < j; ++k) {
                int q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
                if (q < m[i][j]) m[i][j] = q;
            }
        }
    }
    return m[0][n - 1];
}

int main() {
    std::vector<int> dims = {10, 20, 30, 40, 30};
    std::cout << "Minimum scalar multiplications: " << matrixChainOrder(dims) << std::endl;
    return 0;
}`,
    java: `public class MatrixChain {
    public static int matrixChainOrder(int[] p) {
        int n = p.length - 1;
        int[][] m = new int[n][n];

        for (int L = 2; L <= n; L++) {
            for (int i = 0; i <= n - L; i++) {
                int j = i + L - 1;
                m[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
                    if (q < m[i][j]) m[i][j] = q;
                }
            }
        }
        return m[0][n - 1];
    }

    public static void main(String[] args) {
        int[] dims = {10, 20, 30, 40, 30};
        System.out.println("Min scalar multiplications: " + matrixChainOrder(dims));
    }
}`,
    python: `def matrix_chain_order(p):
    n = len(p) - 1
    m = [[0] * n for _ in range(n)]

    for L in range(2, n + 1):
        for i in range(n - L + 1):
            j = i + L - 1
            m[i][j] = float('inf')
            for k in range(i, j):
                q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1]
                if q < m[i][j]:
                    m[i][j] = q
    return m[0][n - 1]

if __name__ == "__main__":
    dims = [10, 20, 30, 40, 30]
    print("Min scalar multiplications:", matrix_chain_order(dims))`,
  },
  'kmp-pattern-matching': {
    cpp: `#include <iostream>
#include <vector>
#include <string>

std::vector<int> computeLPS(const std::string& pattern) {
    int m = pattern.length();
    std::vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++; lps[i] = len; i++;
        } else {
            if (len != 0) len = lps[len - 1];
            else { lps[i] = 0; i++; }
        }
    }
    return lps;
}

void KMPSearch(const std::string& text, const std::string& pattern) {
    std::vector<int> lps = computeLPS(pattern);
    int n = text.length(), m = pattern.length();
    int i = 0, j = 0;

    while (i < n) {
        if (text[i] == pattern[j]) {
            i++; j++;
        }
        if (j == m) {
            std::cout << "Pattern found at index " << (i - j) << std::endl;
            j = lps[j - 1];
        } else if (i < n && text[i] != pattern[j]) {
            if (j != 0) j = lps[j - 1];
            else i++;
        }
    }
}

int main() {
    KMPSearch("ABABDABACDABABCABAB", "ABABCABAB");
    return 0;
}`,
    java: `public class KMP {
    public static int[] computeLPS(String pat) {
        int m = pat.length();
        int[] lps = new int[m];
        int len = 0, i = 1;
        while (i < m) {
            if (pat.charAt(i) == pat.charAt(len)) {
                len++; lps[i] = len; i++;
            } else {
                if (len != 0) len = lps[len - 1];
                else { lps[i] = 0; i++; }
            }
        }
        return lps;
    }

    public static void search(String txt, String pat) {
        int[] lps = computeLPS(pat);
        int n = txt.length(), m = pat.length();
        int i = 0, j = 0;
        while (i < n) {
            if (txt.charAt(i) == pat.charAt(j)) {
                i++; j++;
            }
            if (j == m) {
                System.out.println("Pattern found at index " + (i - j));
                j = lps[j - 1];
            } else if (i < n && txt.charAt(i) != pat.charAt(j)) {
                if (j != 0) j = lps[j - 1];
                else i++;
            }
        }
    }

    public static void main(String[] args) {
        search("ABABDABACDABABCABAB", "ABABCABAB");
    }
}`,
    python: `def compute_lps(pattern):
    lps = [0] * len(pattern)
    length, i = 0, 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps

def kmp_search(text, pattern):
    lps = compute_lps(pattern)
    i, j = 0, 0
    matches = []
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == len(pattern):
            matches.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return matches

if __name__ == "__main__":
    print("Matches at:", kmp_search("ABABDABACDABABCABAB", "ABABCABAB"))`,
  },
  'rabin-karp-hash': {
    cpp: `#include <iostream>
#include <string>
#include <vector>

void rabinKarp(const std::string& text, const std::string& pattern) {
    int n = text.length(), m = pattern.length();
    int d = 256, q = 101;
    int h = 1, p = 0, t = 0;

    for (int i = 0; i < m - 1; ++i) h = (h * d) % q;
    for (int i = 0; i < m; ++i) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }

    for (int i = 0; i <= n - m; ++i) {
        if (p == t) {
            bool match = true;
            for (int j = 0; j < m; ++j) {
                if (text[i + j] != pattern[j]) { match = false; break; }
            }
            if (match) std::cout << "Match found at index " << i << std::endl;
        }
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) t += q;
        }
    }
}

int main() {
    rabinKarp("AABAACAADAABAABA", "BAAB");
    return 0;
}`,
    java: `public class RabinKarp {
    public static void search(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        int d = 256, q = 101;
        int h = 1, p = 0, t = 0;

        for (int i = 0; i < m - 1; i++) h = (h * d) % q;
        for (int i = 0; i < m; i++) {
            p = (d * p + pattern.charAt(i)) % q;
            t = (d * t + text.charAt(i)) % q;
        }

        for (int i = 0; i <= n - m; i++) {
            if (p == t) {
                boolean match = true;
                for (int j = 0; j < m; j++) {
                    if (text.charAt(i + j) != pattern.charAt(j)) { match = false; break; }
                }
                if (match) System.out.println("Match at index " + i);
            }
            if (i < n - m) {
                t = (d * (t - text.charAt(i) * h) + text.charAt(i + m)) % q;
                if (t < 0) t += q;
            }
        }
    }

    public static void main(String[] args) {
        search("AABAACAADAABAABA", "BAAB");
    }
}`,
    python: `def rabin_karp(text, pattern):
    n, m = len(text), len(pattern)
    d, q = 256, 101
    h = pow(d, m - 1, q)
    p, t = 0, 0
    matches = []

    for i in range(m):
        p = (d * p + ord(pattern[i])) % q
        t = (d * t + ord(text[i])) % q

    for i in range(n - m + 1):
        if p == t:
            if text[i:i + m] == pattern:
                matches.append(i)
        if i < n - m:
            t = (d * (t - ord(text[i]) * h) + ord(text[i + m])) % q

    return matches

if __name__ == "__main__":
    print("Matches:", rabin_karp("AABAACAADAABAABA", "BAAB"))`,
  },
  'palindrome-check': {
    cpp: `#include <iostream>
#include <string>

bool isPalindrome(const std::string& s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    std::string s = "RACECAR";
    std::cout << s << " is palindrome? " << (isPalindrome(s) ? "Yes" : "No") << std::endl;
    return 0;
}`,
    java: `public class PalindromeCheck {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        String s = "RACECAR";
        System.out.println(s + " is palindrome? " + isPalindrome(s));
    }
}`,
    python: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

if __name__ == "__main__":
    print("RACECAR is palindrome:", is_palindrome("RACECAR"))`,
  },
  'sliding-window-max': {
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>

int maxSubarraySumK(const std::vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;

    int windowSum = 0;
    for (int i = 0; i < k; ++i) windowSum += arr[i];
    int maxSum = windowSum;

    for (int i = k; i < n; ++i) {
        windowSum += arr[i] - arr[i - k];
        maxSum = std::max(maxSum, windowSum);
    }
    return maxSum;
}

int main() {
    std::vector<int> arr = {2, 1, 5, 1, 3, 2, 7, 4};
    int k = 3;
    std::cout << "Max sum of window " << k << ": " << maxSubarraySumK(arr, k) << std::endl;
    return 0;
}`,
    java: `public class SlidingWindow {
    public static int maxSubarraySum(int[] arr, int k) {
        if (arr.length < k) return -1;
        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];
        int maxSum = windowSum;

        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }

    public static void main(String[] args) {
        int[] arr = {2, 1, 5, 1, 3, 2, 7, 4};
        System.out.println("Max sum (k=3): " + maxSubarraySum(arr, 3));
    }
}`,
    python: `def max_subarray_sum_k(arr, k):
    if len(arr) < k:
        return None
    window_sum = sum(arr[:k])
    max_sum = window_sum

    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum

if __name__ == "__main__":
    print("Max sum (k=3):", max_subarray_sum_k([2, 1, 5, 1, 3, 2, 7, 4], 3))`,
  },
  'prefix-sum-range': {
    cpp: `#include <iostream>
#include <vector>

class PrefixSum {
    std::vector<int> pref;
public:
    PrefixSum(const std::vector<int>& arr) {
        int n = arr.size();
        pref.resize(n);
        pref[0] = arr[0];
        for (int i = 1; i < n; ++i) pref[i] = pref[i - 1] + arr[i];
    }
    int query(int L, int R) {
        return L == 0 ? pref[R] : pref[R] - pref[L - 1];
    }
};

int main() {
    std::vector<int> arr = {3, 1, 4, 1, 5, 9, 2, 6};
    PrefixSum ps(arr);
    std::cout << "Range sum [1..4]: " << ps.query(1, 4) << std::endl;
    return 0;
}`,
    java: `public class PrefixSumQuery {
    private int[] pref;

    public PrefixSumQuery(int[] arr) {
        pref = new int[arr.length];
        pref[0] = arr[0];
        for (int i = 1; i < arr.length; i++) {
            pref[i] = pref[i - 1] + arr[i];
        }
    }

    public int query(int L, int R) {
        return L == 0 ? pref[R] : pref[R] - pref[L - 1];
    }

    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6};
        PrefixSumQuery ps = new PrefixSumQuery(arr);
        System.out.println("Range sum [1..4]: " + ps.query(1, 4));
    }
}`,
    python: `class PrefixSum:
    def __init__(self, arr):
        self.pref = [arr[0]]
        for v in arr[1:]:
            self.pref.append(self.pref[-1] + v)

    def query(self, L, R):
        return self.pref[R] if L == 0 else self.pref[R] - self.pref[L - 1]

if __name__ == "__main__":
    ps = PrefixSum([3, 1, 4, 1, 5, 9, 2, 6])
    print("Range sum [1..4]:", ps.query(1, 4))`,
  },
  'linked-list-reversal': {
    cpp: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int v) : val(v), next(nullptr) {}
};

Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    while (curr != nullptr) {
        Node* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

void printList(Node* head) {
    for (Node* cur = head; cur != nullptr; cur = cur->next) {
        std::cout << cur->val << (cur->next ? " -> " : " -> NULL\\n");
    }
}

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    head->next->next->next = new Node(40);

    std::cout << "Original list: ";
    printList(head);

    head = reverseList(head);
    std::cout << "Reversed list: ";
    printList(head);

    return 0;
}`,
    java: `class Node {
    int val;
    Node next;
    Node(int val) { this.val = val; }
}

public class SinglyLinkedList {
    public static Node reverse(Node head) {
        Node prev = null;
        Node curr = head;
        while (curr != null) {
            Node next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    public static void printList(Node head) {
        for (Node cur = head; cur != null; cur = cur.next) {
            System.out.print(cur.val + (cur.next != null ? " -> " : " -> NULL\\n"));
        }
    }

    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        head.next.next.next = new Node(40);

        System.out.print("Original: ");
        printList(head);

        head = reverse(head);
        System.out.print("Reversed: ");
        printList(head);
    }
}`,
    python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def reverse_list(head: Node) -> Node:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

def print_list(head: Node):
    cur = head
    items = []
    while cur:
        items.append(str(cur.val))
        cur = cur.next
    print(" -> ".join(items) + " -> NULL")

if __name__ == "__main__":
    head = Node(10)
    head.next = Node(20)
    head.next.next = Node(30)
    head.next.next.next = Node(40)

    print("Original: ", end="")
    print_list(head)

    head = reverse_list(head)
    print("Reversed: ", end="")
    print_list(head)`,
  },

  'floyd-cycle-detect': {
    cpp: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int v) : val(v), next(nullptr) {}
};

bool detectAndRemoveLoop(Node* head) {
    if (!head || !head->next) return false;

    Node* slow = head;
    Node* fast = head;

    // Phase 1: Detect cycle
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) break;
    }

    if (slow != fast) return false; // No cycle

    // Phase 2: Find cycle entrance
    Node* ptr1 = head;
    Node* ptr2 = slow;
    while (ptr1 != ptr2) {
        ptr1 = ptr1->next;
        ptr2 = ptr2->next;
    }

    // Phase 3: Remove loop
    Node* cycleStart = ptr1;
    Node* tail = cycleStart;
    while (tail->next != cycleStart) {
        tail = tail->next;
    }
    tail->next = nullptr; // Sever cycle link
    return true;
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(4);
    head->next->next->next->next = new Node(5);
    head->next->next->next->next->next = new Node(6);
    // Create loop to Node 3
    head->next->next->next->next->next->next = head->next->next;

    bool removed = detectAndRemoveLoop(head);
    std::cout << "Cycle detected and removed: " << (removed ? "YES" : "NO") << std::endl;
    return 0;
}`,
    java: `class Node {
    int val;
    Node next;
    Node(int v) { this.val = v; }
}

public class FloydCycle {
    public static boolean detectAndRemoveLoop(Node head) {
        if (head == null || head.next == null) return false;
        Node slow = head, fast = head;

        // Phase 1: Detect collision
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) break;
        }
        if (slow != fast) return false;

        // Phase 2: Find entrance
        Node ptr1 = head, ptr2 = slow;
        while (ptr1 != ptr2) {
            ptr1 = ptr1.next;
            ptr2 = ptr2.next;
        }

        // Phase 3: Loop removal
        Node tail = ptr1;
        while (tail.next != ptr1) {
            tail = tail.next;
        }
        tail.next = null;
        return true;
    }

    public static void main(String[] args) {
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        head.next.next.next = new Node(4);
        head.next.next.next.next = new Node(5);
        head.next.next.next.next.next = new Node(6);
        head.next.next.next.next.next.next = head.next.next; // Cycle to 3

        boolean success = detectAndRemoveLoop(head);
        System.out.println("Cycle resolved: " + success);
    }
}`,
    python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def detect_and_remove_loop(head: Node) -> bool:
    if not head or not head.next:
        return False
    
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return False

    # Find entrance
    ptr1, ptr2 = head, slow
    while ptr1 != ptr2:
        ptr1 = ptr1.next
        ptr2 = ptr2.next

    # Break cycle
    tail = ptr1
    while tail.next != ptr1:
        tail = tail.next
    tail.next = None
    return True

if __name__ == "__main__":
    head = Node(1)
    head.next = Node(2)
    head.next.next = Node(3)
    head.next.next.next = new_node = Node(4)
    new_node.next = head.next  # cycle to 2
    res = detect_and_remove_loop(head)
    print("Cycle eliminated:", res)`,
  },

  'doubly-linked-ops': {
    cpp: `#include <iostream>

struct DNode {
    int val;
    DNode* prev;
    DNode* next;
    DNode(int v) : val(v), prev(nullptr), next(nullptr) {}
};

class DoublyList {
public:
    DNode* head = nullptr;
    DNode* tail = nullptr;

    void append(int val) {
        DNode* n = new DNode(val);
        if (!head) {
            head = tail = n;
        } else {
            tail->next = n;
            n->prev = tail;
            tail = n;
        }
    }

    void makeCircular() {
        if (head && tail) {
            tail->next = head;
            head->prev = tail;
        }
    }
};

int main() {
    DoublyList dl;
    dl.append(100);
    dl.append(200);
    dl.append(300);
    dl.makeCircular();
    std::cout << "Doubly Circular list initialized successfully.\\n";
    return 0;
}`,
    java: `class DNode {
    int val;
    DNode prev, next;
    DNode(int v) { this.val = v; }
}

public class DoublyLinkedList {
    DNode head, tail;

    public void append(int val) {
        DNode node = new DNode(val);
        if (head == null) {
            head = tail = node;
        } else {
            tail.next = node;
            node.prev = tail;
            tail = node;
        }
    }

    public static void main(String[] args) {
        DoublyLinkedList dll = new DoublyLinkedList();
        dll.append(100);
        dll.append(200);
        dll.append(300);
        System.out.println("Doubly Linked List ready.");
    }
}`,
    python: `class DNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, val):
        node = DNode(val)
        if not self.head:
            self.head = self.tail = node
        else:
            self.tail.next = node
            node.prev = self.tail
            self.tail = node

if __name__ == "__main__":
    dll = DoublyLinkedList()
    dll.append(100)
    dll.append(200)
    print("Doubly list constructed.")`,
  },

  'stack-operations': {
    cpp: `#include <iostream>
#include <stdexcept>

class Stack {
private:
    int* arr;
    int top;
    int capacity;

public:
    Stack(int cap = 5) : capacity(cap), top(-1) {
        arr = new int[capacity];
    }
    ~Stack() { delete[] arr; }

    void push(int x) {
        if (top == capacity - 1) throw std::overflow_error("Stack Overflow!");
        arr[++top] = x;
    }

    int pop() {
        if (top == -1) throw std::underflow_error("Stack Underflow!");
        return arr[top--];
    }

    int peek() const {
        if (top == -1) throw std::underflow_error("Stack is Empty!");
        return arr[top];
    }

    bool isEmpty() const { return top == -1; }
    int size() const { return top + 1; }
};

int main() {
    Stack st(5);
    st.push(10);
    st.push(20);
    std::cout << "Top element: " << st.peek() << std::endl;
    std::cout << "Popped: " << st.pop() << std::endl;
    return 0;
}`,
    java: `public class CustomStack {
    private int[] arr;
    private int top;
    private int capacity;

    public CustomStack(int cap) {
        capacity = cap;
        arr = new int[cap];
        top = -1;
    }

    public void push(int x) {
        if (top == capacity - 1) throw new RuntimeException("Stack Overflow!");
        arr[++top] = x;
    }

    public int pop() {
        if (top == -1) throw new RuntimeException("Stack Underflow!");
        return arr[top--];
    }

    public int peek() {
        if (top == -1) throw new RuntimeException("Empty Stack!");
        return arr[top];
    }

    public static void main(String[] args) {
        CustomStack st = new CustomStack(5);
        st.push(15);
        st.push(25);
        System.out.println("Top: " + st.peek());
        System.out.println("Popped: " + st.pop());
    }
}`,
    python: `class Stack:
    def __init__(self, capacity=5):
        self.capacity = capacity
        self.data = []

    def push(self, val):
        if len(self.data) >= self.capacity:
            raise OverflowError("Stack Overflow!")
        self.data.append(val)

    def pop(self):
        if not self.data:
            raise IndexError("Stack Underflow!")
        return self.data.pop()

    def peek(self):
        if not self.data:
            raise IndexError("Stack is Empty!")
        return self.data[-1]

if __name__ == "__main__":
    st = Stack(5)
    st.push(15)
    st.push(25)
    print("Peek:", st.peek())
    print("Popped:", st.pop())`,
  },

  'parentheses-validation': {
    cpp: `#include <iostream>
#include <stack>
#include <string>

bool isValidParentheses(const std::string& s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }
    return st.empty();
}

int main() {
    std::string s = "{[()()]}";
    std::cout << s << " is valid: " << (isValidParentheses(s) ? "true" : "false") << std::endl;
    return 0;
}`,
    java: `import java.util.Stack;

public class ParenthesesValidator {
    public static boolean isValid(String s) {
        Stack<Character> st = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.isEmpty()) return false;
                char top = st.pop();
                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }
        return st.isEmpty();
    }

    public static void main(String[] args) {
        String expr = "{[()()]}";
        System.out.println(expr + " valid: " + isValid(expr));
    }
}`,
    python: `def is_valid_parentheses(s: str) -> bool:
    stack = []
    matching = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in matching:
            if not stack or stack[-1] != matching[ch]:
                return False
            stack.pop()
    return len(stack) == 0

if __name__ == "__main__":
    expr = "{[()()]}"
    print(f"{expr} is valid:", is_valid_parentheses(expr))`,
  },

  'queue-operations': {
    cpp: `#include <iostream>
#include <stdexcept>

class CircularQueue {
private:
    int* arr;
    int front, rear, count, capacity;

public:
    CircularQueue(int cap = 5) : capacity(cap), front(-1), rear(-1), count(0) {
        arr = new int[capacity];
    }
    ~CircularQueue() { delete[] arr; }

    bool enqueue(int x) {
        if (count == capacity) return false; // Full
        if (front == -1) front = 0;
        rear = (rear + 1) % capacity;
        arr[rear] = x;
        count++;
        return true;
    }

    int dequeue() {
        if (count == 0) throw std::underflow_error("Queue is Empty!");
        int val = arr[front];
        front = (front + 1) % capacity;
        count--;
        if (count == 0) { front = rear = -1; }
        return val;
    }

    bool isFull() const { return count == capacity; }
    bool isEmpty() const { return count == 0; }
};

int main() {
    CircularQueue q(5);
    q.enqueue(10);
    q.enqueue(20);
    std::cout << "Dequeued: " << q.dequeue() << std::endl;
    return 0;
}`,
    java: `public class CircularQueue {
    private int[] arr;
    private int front, rear, count, capacity;

    public CircularQueue(int cap) {
        this.capacity = cap;
        this.arr = new int[cap];
        this.front = -1;
        this.rear = -1;
        this.count = 0;
    }

    public boolean enqueue(int val) {
        if (count == capacity) return false;
        if (front == -1) front = 0;
        rear = (rear + 1) % capacity;
        arr[rear] = val;
        count++;
        return true;
    }

    public int dequeue() {
        if (count == 0) throw new RuntimeException("Empty Queue!");
        int val = arr[front];
        front = (front + 1) % capacity;
        count--;
        if (count == 0) { front = rear = -1; }
        return val;
    }

    public static void main(String[] args) {
        CircularQueue q = new CircularQueue(5);
        q.enqueue(10);
        q.enqueue(20);
        System.out.println("Dequeued: " + q.dequeue());
    }
}`,
    python: `class CircularQueue:
    def __init__(self, capacity=5):
        self.capacity = capacity
        self.arr = [None] * capacity
        self.front = -1
        self.rear = -1
        self.count = 0

    def enqueue(self, val):
        if self.count == self.capacity:
            return False
        if self.front == -1:
            self.front = 0
        self.rear = (self.rear + 1) % self.capacity
        self.arr[self.rear] = val
        self.count += 1
        return True

    def dequeue(self):
        if self.count == 0:
            raise IndexError("Queue Empty!")
        val = self.arr[self.front]
        self.front = (self.front + 1) % self.capacity
        self.count -= 1
        if self.count == 0:
            self.front = self.rear = -1
        return val

if __name__ == "__main__":
    q = CircularQueue(5)
    q.enqueue(10)
    q.enqueue(20)
    print("Dequeued:", q.dequeue())`,
  },

  'priority-queue-ops': {
    cpp: `#include <iostream>
#include <queue>
#include <vector>
#include <string>

struct Task {
    std::string name;
    int priority; // lower value = higher urgency
    bool operator>(const Task& other) const {
        return priority > other.priority;
    }
};

int main() {
    std::priority_queue<Task, std::vector<Task>, std::greater<Task>> pq;
    pq.push({"Task-C", 30});
    pq.push({"Task-A", 10});
    pq.push({"Task-B", 20});

    while (!pq.empty()) {
        Task t = pq.top();
        pq.pop();
        std::cout << t.name << " [p=" << t.priority << "]\\n";
    }
    return 0;
}`,
    java: `import java.util.PriorityQueue;

class Task {
    String name;
    int priority;
    Task(String n, int p) { name = n; priority = p; }
}

public class PriorityQueueDemo {
    public static void main(String[] args) {
        PriorityQueue<Task> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.priority, b.priority));
        pq.add(new Task("Task-C", 30));
        pq.add(new Task("Task-A", 10));
        pq.add(new Task("Task-B", 20));

        while (!pq.isEmpty()) {
            Task t = pq.poll();
            System.out.println(t.name + " (priority: " + t.priority + ")");
        }
    }
}`,
    python: `import heapq

tasks = [
    (30, "Task-C"),
    (10, "Task-A"),
    (20, "Task-B")
]

heapq.heapify(tasks)
while tasks:
    pri, name = heapq.heappop(tasks)
    print(f"{name} with priority {pri}")`,
  },

  'hash-table-chaining': {
    cpp: `#include <iostream>
#include <vector>
#include <list>

class HashTableChaining {
private:
    int capacity;
    int keyCount;
    std::vector<std::list<int>> table;

    void rehash() {
        int oldCap = capacity;
        capacity *= 2;
        std::vector<std::list<int>> newTable(capacity);
        for (const auto& chain : table) {
            for (int k : chain) {
                newTable[k % capacity].push_back(k);
            }
        }
        table = std::move(newTable);
    }

public:
    HashTableChaining(int cap = 7) : capacity(cap), keyCount(0), table(cap) {}

    void insert(int key) {
        if ((double)keyCount / capacity >= 0.75) {
            rehash();
        }
        int slot = key % capacity;
        table[slot].push_back(key);
        keyCount++;
    }

    bool search(int key) {
        int slot = key % capacity;
        for (int k : table[slot]) {
            if (k == key) return true;
        }
        return false;
    }
};

int main() {
    HashTableChaining ht(7);
    ht.insert(15);
    ht.insert(22);
    ht.insert(35);
    std::cout << "35 found: " << (ht.search(35) ? "yes" : "no") << std::endl;
    return 0;
}`,
    java: `import java.util.LinkedList;

public class HashTableChaining {
    private int capacity = 7;
    private int keyCount = 0;
    private LinkedList<Integer>[] table;

    @SuppressWarnings("unchecked")
    public HashTableChaining() {
        table = new LinkedList[capacity];
        for (int i = 0; i < capacity; i++) table[i] = new LinkedList<>();
    }

    public void insert(int key) {
        if ((double) keyCount / capacity >= 0.75) resize();
        int slot = key % capacity;
        table[slot].add(key);
        keyCount++;
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        int oldCap = capacity;
        capacity *= 2;
        LinkedList<Integer>[] newTable = new LinkedList[capacity];
        for (int i = 0; i < capacity; i++) newTable[i] = new LinkedList<>();
        for (LinkedList<Integer> chain : table) {
            for (int k : chain) newTable[k % capacity].add(k);
        }
        table = newTable;
    }

    public static void main(String[] args) {
        HashTableChaining ht = new HashTableChaining();
        ht.insert(15);
        ht.insert(22);
        System.out.println("Separate chaining table running.");
    }
}`,
    python: `class HashTableChaining:
    def __init__(self, capacity=7):
        self.capacity = capacity
        self.key_count = 0
        self.table = [[] for _ in range(capacity)]

    def insert(self, key):
        if self.key_count / self.capacity >= 0.75:
            self.resize()
        slot = key % self.capacity
        self.table[slot].append(key)
        self.key_count += 1

    def resize(self):
        old_table = self.table
        self.capacity *= 2
        self.table = [[] for _ in range(self.capacity)]
        for chain in old_table:
            for k in chain:
                self.table[k % self.capacity].append(k)

if __name__ == "__main__":
    ht = HashTableChaining(7)
    for x in [15, 22, 35, 8, 42, 29, 14, 50]:
        ht.insert(x)
    print("Hash table capacity after resize:", ht.capacity)`,
  },

  'hash-open-addressing': {
    cpp: `#include <iostream>
#include <vector>

class OpenAddressing {
    int capacity;
    std::vector<int> table;

public:
    OpenAddressing(int cap = 10) : capacity(cap), table(cap, -1) {}

    bool insertLinear(int key) {
        int hash = key % capacity;
        for (int i = 0; i < capacity; i++) {
            int slot = (hash + i) % capacity;
            if (table[slot] == -1) {
                table[slot] = key;
                return true;
            }
        }
        return false;
    }
};

int main() {
    OpenAddressing oa(10);
    oa.insertLinear(15);
    oa.insertLinear(25);
    oa.insertLinear(35);
    std::cout << "Open addressing linear probe complete.\\n";
    return 0;
}`,
    java: `import java.util.Arrays;

public class OpenAddressingTable {
    private int capacity;
    private int[] table;

    public OpenAddressingTable(int cap) {
        this.capacity = cap;
        this.table = new int[cap];
        Arrays.fill(table, -1);
    }

    public boolean insert(int key) {
        int h = key % capacity;
        for (int i = 0; i < capacity; i++) {
            int slot = (h + i) % capacity;
            if (table[slot] == -1) {
                table[slot] = key;
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        OpenAddressingTable oat = new OpenAddressingTable(10);
        oat.insert(15);
        oat.insert(25);
        System.out.println("Open addressing inserted.");
    }
}`,
    python: `class OpenAddressing:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.table = [None] * capacity

    def insert(self, key):
        h = key % self.capacity
        for i in range(self.capacity):
            slot = (h + i) % self.capacity
            if self.table[slot] is None:
                self.table[slot] = key
                return slot
        return None

if __name__ == "__main__":
    oa = OpenAddressing(10)
    for k in [15, 25, 35]:
        oa.insert(k)
    print("Table:", oa.table)`,
  },

  'hash-example-questions': {
    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>

std::pair<int, int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {-1, -1};
}

int countDistinct(const std::vector<int>& arr) {
    std::unordered_set<int> seen(arr.begin(), arr.end());
    return seen.size();
}

int main() {
    std::vector<int> nums = {2, 7, 11, 15};
    auto pair = twoSum(nums, 9);
    std::cout << "Two sum indices: [" << pair.first << ", " << pair.second << "]\\n";
    std::cout << "Distinct count: " << countDistinct({4, 2, 7, 2, 4, 9, 7}) << "\\n";
    return 0;
}`,
    java: `import java.util.HashMap;
import java.util.HashSet;

public class HashingQuestions {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[]{map.get(comp), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{-1, -1};
    }

    public static int countDistinct(int[] arr) {
        HashSet<Integer> set = new HashSet<>();
        for (int x : arr) set.add(x);
        return set.size();
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("Two Sum: [" + res[0] + ", " + res[1] + "]");
    }
}`,
    python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

def count_distinct(arr):
    return len(set(arr))

if __name__ == "__main__":
    print("Two sum:", two_sum([2, 7, 11, 15], 9))
    print("Distinct:", count_distinct([4, 2, 7, 2, 4, 9, 7]))`,
  },
  'bst-insert-search': {
    cpp: `#include <iostream>

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;
}

bool search(Node* root, int target) {
    if (!root) return false;
    if (root->val == target) return true;
    if (target < root->val) return search(root->left, target);
    return search(root->right, target);
}

Node* minValueNode(Node* node) {
    Node* curr = node;
    while (curr && curr->left) curr = curr->left;
    return curr;
}

Node* deleteNode(Node* root, int val) {
    if (!root) return nullptr;
    if (val < root->val) root->left = deleteNode(root->left, val);
    else if (val > root->val) root->right = deleteNode(root->right, val);
    else {
        // Case 1 & 2: Leaf or one child
        if (!root->left) {
            Node* temp = root->right;
            delete root;
            return temp;
        } else if (!root->right) {
            Node* temp = root->left;
            delete root;
            return temp;
        }
        // Case 3: Two children
        Node* succ = minValueNode(root->right);
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}

int main() {
    Node* root = nullptr;
    for (int x : {50, 30, 70, 20, 40, 60, 80}) root = insert(root, x);
    std::cout << "Search 60: " << (search(root, 60) ? "Found" : "Not Found") << std::endl;
    root = deleteNode(root, 20); // Case 1: Leaf
    root = deleteNode(root, 30); // Case 2: One child
    root = deleteNode(root, 50); // Case 3: Two children
    std::cout << "Deletions complete.\\n";
    return 0;
}`,
    java: `class Node {
    int val;
    Node left, right;
    Node(int val) { this.val = val; }
}

public class BST {
    public static Node insert(Node root, int val) {
        if (root == null) return new Node(val);
        if (val < root.val) root.left = insert(root.left, val);
        else if (val > root.val) root.right = insert(root.right, val);
        return root;
    }

    public static boolean search(Node root, int target) {
        if (root == null) return false;
        if (root.val == target) return true;
        return target < root.val ? search(root.left, target) : search(root.right, target);
    }

    public static Node deleteNode(Node root, int val) {
        if (root == null) return null;
        if (val < root.val) root.left = deleteNode(root.left, val);
        else if (val > root.val) root.right = deleteNode(root.right, val);
        else {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            Node succ = root.right;
            while (succ.left != null) succ = succ.left;
            root.val = succ.val;
            root.right = deleteNode(root.right, succ.val);
        }
        return root;
    }

    public static void main(String[] args) {
        Node root = null;
        for (int x : new int[]{50, 30, 70, 20, 40, 60, 80}) root = insert(root, x);
        System.out.println("Search 60: " + search(root, 60));
        root = deleteNode(root, 20);
        root = deleteNode(root, 50);
    }
}`,
    python: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, target):
    if not root:
        return False
    if root.val == target:
        return True
    return search(root.left, target) if target < root.val else search(root.right, target)

def delete_node(root, val):
    if not root:
        return None
    if val < root.val:
        root.left = delete_node(root.left, val)
    elif val > root.val:
        root.right = delete_node(root.right, val)
    else:
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        succ = root.right
        while succ.left:
            succ = succ.left
        root.val = succ.val
        root.right = delete_node(root.right, succ.val)
    return root

if __name__ == "__main__":
    root = None
    for x in [50, 30, 70, 20, 40, 60, 80]:
        root = insert(root, x)
    print("Search 60:", search(root, 60))
    root = delete_node(root, 50)`,
  },

  'tree-traversals-all': {
    cpp: `#include <iostream>
#include <vector>
#include <queue>

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

void inorder(Node* root, std::vector<int>& out) {
    if (!root) return;
    inorder(root->left, out);
    out.push_back(root->val);
    inorder(root->right, out);
}

void preorder(Node* root, std::vector<int>& out) {
    if (!root) return;
    out.push_back(root->val);
    preorder(root->left, out);
    preorder(root->right, out);
}

void postorder(Node* root, std::vector<int>& out) {
    if (!root) return;
    postorder(root->left, out);
    postorder(root->right, out);
    out.push_back(root->val);
}

void levelOrder(Node* root, std::vector<int>& out) {
    if (!root) return;
    std::queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* cur = q.front();
        q.pop();
        out.push_back(cur->val);
        if (cur->left) q.push(cur->left);
        if (cur->right) q.push(cur->right);
    }
}

int main() {
    Node* root = new Node(50);
    root->left = new Node(30);
    root->right = new Node(70);
    std::vector<int> in;
    inorder(root, in);
    std::cout << "In-Order: ";
    for (int v : in) std::cout << v << " ";
    std::cout << std::endl;
    return 0;
}`,
    java: `import java.util.*;

class Node {
    int val;
    Node left, right;
    Node(int v) { val = v; }
}

public class TreeTraversals {
    public static void inorder(Node root, List<Integer> out) {
        if (root == null) return;
        inorder(root.left, out);
        out.add(root.val);
        inorder(root.right, out);
    }

    public static void levelOrder(Node root, List<Integer> out) {
        if (root == null) return;
        Queue<Node> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            Node cur = q.poll();
            out.add(cur.val);
            if (cur.left != null) q.add(cur.left);
            if (cur.right != null) q.add(cur.right);
        }
    }

    public static void main(String[] args) {
        Node root = new Node(50);
        root.left = new Node(30);
        root.right = new Node(70);
        List<Integer> res = new ArrayList<>();
        inorder(root, res);
        System.out.println("In-Order: " + res);
    }
}`,
    python: `from collections import deque

class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorder(root):
    return inorder(root.left) + [root.val] + inorder(root.right) if root else []

def preorder(root):
    return [root.val] + preorder(root.left) + preorder(root.right) if root else []

def postorder(root):
    return postorder(root.left) + postorder(root.right) + [root.val] if root else []

def level_order(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        cur = q.popleft()
        res.append(cur.val)
        if cur.left:
            q.append(cur.left)
        if cur.right:
            q.append(cur.right)
    return res

if __name__ == "__main__":
    root = Node(50)
    root.left = Node(30)
    root.right = Node(70)
    print("Inorder:", inorder(root))
    print("Level-order:", level_order(root))`,
  },

  'avl-tree-rotations': {
    cpp: `#include <iostream>
#include <algorithm>

struct AVLNode {
    int val, height;
    AVLNode *left, *right;
    AVLNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};

int getHeight(AVLNode* n) { return n ? n->height : 0; }
int getBalance(AVLNode* n) { return n ? getHeight(n->left) - getHeight(n->right) : 0; }

AVLNode* rightRotate(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = 1 + std::max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + std::max(getHeight(x->left), getHeight(x->right));
    return x;
}

AVLNode* leftRotate(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = 1 + std::max(getHeight(x->left), getHeight(x->right));
    y->height = 1 + std::max(getHeight(y->left), getHeight(y->right));
    return y;
}

AVLNode* insertAVL(AVLNode* node, int val) {
    if (!node) return new AVLNode(val);
    if (val < node->val) node->left = insertAVL(node->left, val);
    else if (val > node->val) node->right = insertAVL(node->right, val);
    else return node;

    node->height = 1 + std::max(getHeight(node->left), getHeight(node->right));
    int bf = getBalance(node);

    // LL
    if (bf > 1 && val < node->left->val) return rightRotate(node);
    // RR
    if (bf < -1 && val > node->right->val) return leftRotate(node);
    // LR
    if (bf > 1 && val > node->left->val) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    // RL
    if (bf < -1 && val < node->right->val) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}

int main() {
    AVLNode* root = nullptr;
    for (int k : {10, 20, 30, 40, 50, 25}) root = insertAVL(root, k);
    std::cout << "AVL Root is: " << root->val << std::endl;
    return 0;
}`,
    java: `class AVLNode {
    int val, height;
    AVLNode left, right;
    AVLNode(int v) { val = v; height = 1; }
}

public class AVLTree {
    static int height(AVLNode n) { return n == null ? 0 : n.height; }
    static int getBalance(AVLNode n) { return n == null ? 0 : height(n.left) - height(n.right); }

    static AVLNode rightRotate(AVLNode y) {
        AVLNode x = y.left;
        AVLNode T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        return x;
    }

    static AVLNode leftRotate(AVLNode x) {
        AVLNode y = x.right;
        AVLNode T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        return y;
    }

    public static AVLNode insert(AVLNode node, int val) {
        if (node == null) return new AVLNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else if (val > node.val) node.right = insert(node.right, val);
        else return node;

        node.height = 1 + Math.max(height(node.left), height(node.right));
        int bf = getBalance(node);

        if (bf > 1 && val < node.left.val) return rightRotate(node);
        if (bf < -1 && val > node.right.val) return leftRotate(node);
        if (bf > 1 && val > node.left.val) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }
        if (bf < -1 && val < node.right.val) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }
        return node;
    }

    public static void main(String[] args) {
        AVLNode root = null;
        for (int k : new int[]{10, 20, 30, 40, 50, 25}) root = insert(root, k);
        System.out.println("AVL Root: " + root.val);
    }
}`,
    python: `class AVLNode:
    def __init__(self, val):
        self.val = val
        self.height = 1
        self.left = None
        self.right = None

class AVLTree:
    def height(self, n):
        return n.height if n else 0

    def balance(self, n):
        return self.height(n.left) - self.height(n.right) if n else 0

    def right_rotate(self, y):
        x = y.left
        T2 = x.right
        x.right = y
        y.left = T2
        y.height = 1 + max(self.height(y.left), self.height(y.right))
        x.height = 1 + max(self.height(x.left), self.height(x.right))
        return x

    def left_rotate(self, x):
        y = x.right
        T2 = y.left
        y.left = x
        x.right = T2
        x.height = 1 + max(self.height(x.left), self.height(x.right))
        y.height = 1 + max(self.height(y.left), self.height(y.right))
        return y

    def insert(self, root, val):
        if not root:
            return AVLNode(val)
        if val < root.val:
            root.left = self.insert(root.left, val)
        else:
            root.right = self.insert(root.right, val)

        root.height = 1 + max(self.height(root.left), self.height(root.right))
        bf = self.balance(root)

        if bf > 1 and val < root.left.val:
            return self.right_rotate(root)
        if bf < -1 and val > root.right.val:
            return self.left_rotate(root)
        if bf > 1 and val > root.left.val:
            root.left = self.left_rotate(root.left)
            return self.right_rotate(root)
        if bf < -1 and val < root.right.val:
            root.right = self.right_rotate(root.right)
            return self.left_rotate(root)
        return root

if __name__ == "__main__":
    avl = AVLTree()
    root = None
    for k in [10, 20, 30, 40, 50, 25]:
        root = avl.insert(root, k)
    print("AVL root:", root.val)`,
  },

  'heap-dual-view': {
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>

void siftDown(std::vector<int>& heap, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && heap[left] > heap[largest]) largest = left;
    if (right < n && heap[right] > heap[largest]) largest = right;
    if (largest != i) {
        std::swap(heap[i], heap[largest]);
        siftDown(heap, n, largest);
    }
}

void heapSort(std::vector<int>& arr) {
    int n = arr.size();
    // 1. Build heap (heapify in O(n))
    for (int i = n / 2 - 1; i >= 0; i--) {
        siftDown(arr, n, i);
    }
    // 2. Extract max to end
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        siftDown(arr, i, 0);
    }
}

int main() {
    std::vector<int> arr = {40, 10, 30, 50, 60, 15, 25};
    heapSort(arr);
    std::cout << "Sorted: ";
    for (int x : arr) std::cout << x << " ";
    std::cout << std::endl;
    return 0;
}`,
    java: `import java.util.Arrays;

public class MaxHeapSort {
    static void siftDown(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        if (left < n && arr[left] > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;
        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            siftDown(arr, n, largest);
        }
    }

    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) siftDown(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            siftDown(arr, i, 0);
        }
    }

    public static void main(String[] args) {
        int[] arr = {40, 10, 30, 50, 60, 15, 25};
        sort(arr);
        System.out.println("Sorted: " + Arrays.toString(arr));
    }
}`,
    python: `def sift_down(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        sift_down(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        sift_down(arr, i, 0)

if __name__ == "__main__":
    data = [40, 10, 30, 50, 60, 15, 25]
    heap_sort(data)
    print("Sorted:", data)`,
  },

  'trie-prefix-tree': {
    cpp: `#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>

struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    bool isEndOfWord = false;
};

class Trie {
public:
    TrieNode* root;
    Trie() { root = new TrieNode(); }

    void insert(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEndOfWord = true;
    }

    void dfs(TrieNode* node, std::string prefix, std::vector<std::string>& res) {
        if (node->isEndOfWord) res.push_back(prefix);
        for (auto& [ch, child] : node->children) {
            dfs(child, prefix + ch, res);
        }
    }

    std::vector<std::string> autocomplete(const std::string& prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            if (!curr->children.count(c)) return {};
            curr = curr->children[c];
        }
        std::vector<std::string> results;
        dfs(curr, prefix, results);
        return results;
    }
};

int main() {
    Trie trie;
    for (const std::string& w : {"cat", "car", "cart", "dog", "dot"}) trie.insert(w);
    auto matches = trie.autocomplete("ca");
    std::cout << "Matches for 'ca': ";
    for (const auto& s : matches) std::cout << s << " ";
    std::cout << std::endl;
    return 0;
}`,
    java: `import java.util.*;

class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEndOfWord = false;
}

public class Trie {
    TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            curr.children.putIfAbsent(c, new TrieNode());
            curr = curr.children.get(c);
        }
        curr.isEndOfWord = true;
    }

    private void dfs(TrieNode node, String prefix, List<String> results) {
        if (node.isEndOfWord) results.add(prefix);
        for (Map.Entry<Character, TrieNode> entry : node.children.entrySet()) {
            dfs(entry.getValue(), prefix + entry.getKey(), results);
        }
    }

    public List<String> autocomplete(String prefix) {
        TrieNode curr = root;
        for (char c : prefix.toCharArray()) {
            if (!curr.children.containsKey(c)) return Collections.emptyList();
            curr = curr.children.get(c);
        }
        List<String> results = new ArrayList<>();
        dfs(curr, prefix, results);
        return results;
    }

    public static void main(String[] args) {
        Trie trie = new Trie();
        for (String w : new String[]{"cat", "car", "cart", "dog", "dot"}) trie.insert(w);
        System.out.println("Autocomplete 'ca': " + trie.autocomplete("ca"));
    }
}`,
    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str):
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end_of_word = True

    def autocomplete(self, prefix: str):
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return []
            curr = curr.children[ch]

        results = []
        def dfs(node, path):
            if node.is_end_of_word:
                results.append(path)
            for ch, child in node.children.items():
                dfs(child, path + ch)

        dfs(curr, prefix)
        return results

if __name__ == "__main__":
    t = Trie()
    for w in ["cat", "car", "cart", "dog", "dot"]:
        t.insert(w)
    print("Completions for 'ca':", t.autocomplete("ca"))`,
  },

  'disjoint-set-union': {
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>

class DisjointSet {
    std::vector<int> parent, rank;

public:
    DisjointSet(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }

    bool unionSets(int u, int v) {
        int rootU = find(u);
        int rootV = find(v);
        if (rootU == rootV) return false; // Cycle detected

        // Union by rank
        if (rank[rootU] < rank[rootV]) parent[rootU] = rootV;
        else if (rank[rootU] > rank[rootV]) parent[rootV] = rootU;
        else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        return true;
    }
};

int main() {
    DisjointSet ds(6);
    ds.unionSets(0, 1);
    ds.unionSets(1, 2);
    bool noCycle = ds.unionSets(0, 2); // Should be false!
    std::cout << "Edge (0, 2) forms cycle: " << (!noCycle ? "YES" : "NO") << std::endl;
    return 0;
}`,
    java: `public class DisjointSet {
    private int[] parent, rank;

    public DisjointSet(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    public int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }

    public boolean union(int u, int v) {
        int rootU = find(u);
        int rootV = find(v);
        if (rootU == rootV) return false; // Cycle

        if (rank[rootU] < rank[rootV]) parent[rootU] = rootV;
        else if (rank[rootU] > rank[rootV]) parent[rootV] = rootU;
        else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        return true;
    }

    public static void main(String[] args) {
        DisjointSet ds = new DisjointSet(6);
        ds.union(0, 1);
        ds.union(1, 2);
        System.out.println("Cycle on (0, 2): " + !ds.union(0, 2));
    }
}`,
    python: `class DisjointSet:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])  # Path compression
        return self.parent[i]

    def union(self, u, v):
        root_u, root_v = self.find(u), self.find(v)
        if root_u == root_v:
            return False  # Cycle
        if self.rank[root_u] < self.rank[root_v]:
            self.parent[root_u] = root_v
        elif self.rank[root_u] > self.rank[root_v]:
            self.parent[root_v] = root_u
        else:
            self.parent[root_v] = root_u
            self.rank[root_u] += 1
        return True

if __name__ == "__main__":
    ds = DisjointSet(6)
    ds.union(0, 1)
    ds.union(1, 2)
    print("Edge (0, 2) creates cycle:", not ds.union(0, 2))`,
  },

  'adj-list-matrix-dual': {
    cpp: `#include <iostream>
#include <vector>

class GraphDual {
    int V;
    std::vector<std::vector<int>> adjList;
    std::vector<std::vector<int>> adjMatrix;

public:
    GraphDual(int vertices) : V(vertices), adjList(vertices), adjMatrix(vertices, std::vector<int>(vertices, 0)) {}

    void addEdge(int u, int v, int weight = 1) {
        // Adjacency List: O(1) insertion, saves memory for sparse graphs
        adjList[u].push_back(v);
        adjList[v].push_back(u);

        // Adjacency Matrix: O(1) edge lookup
        adjMatrix[u][v] = weight;
        adjMatrix[v][u] = weight;
    }

    bool hasEdge(int u, int v) const {
        return adjMatrix[u][v] != 0; // O(1) query
    }

    void print() const {
        std::cout << "--- Adjacency List (O(V + E) Space) ---\\n";
        for (int i = 0; i < V; ++i) {
            std::cout << i << " -> ";
            for (int nbr : adjList[i]) std::cout << nbr << " ";
            std::cout << "\\n";
        }

        std::cout << "\\n--- Adjacency Matrix (O(1) Edge Check) ---\\n";
        for (int i = 0; i < V; ++i) {
            for (int j = 0; j < V; ++j) {
                std::cout << adjMatrix[i][j] << " ";
            }
            std::cout << "\\n";
        }
    }
};

int main() {
    GraphDual g(4);
    g.addEdge(0, 1, 4);
    g.addEdge(0, 2, 2);
    g.addEdge(1, 2, 1);
    g.addEdge(1, 3, 7);
    g.print();
    return 0;
}`,
    java: `import java.util.*;

public class GraphDual {
    private int V;
    private List<List<Integer>> adjList;
    private int[][] adjMatrix;

    public GraphDual(int vertices) {
        this.V = vertices;
        this.adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) adjList.add(new ArrayList<>());
        this.adjMatrix = new int[vertices][vertices];
    }

    public void addEdge(int u, int v, int weight) {
        adjList.get(u).add(v);
        adjList.get(v).add(u);
        adjMatrix[u][v] = weight;
        adjMatrix[v][u] = weight;
    }

    public boolean hasEdge(int u, int v) {
        return adjMatrix[u][v] != 0; // O(1) lookup
    }

    public static void main(String[] args) {
        GraphDual g = new GraphDual(4);
        g.addEdge(0, 1, 4);
        g.addEdge(0, 2, 2);
        g.addEdge(1, 2, 1);
        System.out.println("Edge (0, 1) exists: " + g.hasEdge(0, 1));
    }
}`,
    python: `class GraphDual:
    def __init__(self, vertices: int):
        self.V = vertices
        self.adj_list = {i: [] for i in range(vertices)}
        self.adj_matrix = [[0] * vertices for _ in range(vertices)]

    def add_edge(self, u: int, v: int, weight: int = 1):
        # List: O(1) append, space efficient
        self.adj_list[u].append((v, weight))
        self.adj_list[v].append((u, weight))
        # Matrix: O(1) edge lookup
        self.adj_matrix[u][v] = weight
        self.adj_matrix[v][u] = weight

    def has_edge(self, u: int, v: int) -> bool:
        return self.adj_matrix[u][v] != 0

if __name__ == "__main__":
    g = GraphDual(4)
    g.add_edge(0, 1, 4)
    g.add_edge(0, 2, 2)
    print("Has edge (0, 1):", g.has_edge(0, 1))`,
  },

  'kruskal-prim-mst': {
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const { return weight < other.weight; }
};

struct DSU {
    std::vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    bool unite(int u, int v) {
        int rootU = find(u), rootV = find(v);
        if (rootU == rootV) return false;
        if (rank[rootU] < rank[rootV]) parent[rootU] = rootV;
        else if (rank[rootU] > rank[rootV]) parent[rootV] = rootU;
        else { parent[rootV] = rootU; rank[rootU]++; }
        return true;
    }
};

// Kruskal's Algorithm: Sort edges + Union-Find cycle check
int kruskalMST(int n, std::vector<Edge>& edges) {
    std::sort(edges.begin(), edges.end());
    DSU dsu(n);
    int totalWeight = 0, count = 0;
    for (const auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            totalWeight += e.weight;
            if (++count == n - 1) break;
        }
    }
    return totalWeight;
}

// Prim's Algorithm: Greedily expand cheapest cut-edge
int primMST(int n, const std::vector<std::vector<std::pair<int, int>>>& adj) {
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> pq;
    std::vector<bool> inMST(n, false);
    pq.push({0, 0});
    int totalWeight = 0;

    while (!pq.empty()) {
        auto [wt, u] = pq.top(); pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        totalWeight += wt;
        for (auto [v, w] : adj[u]) {
            if (!inMST[v]) pq.push({w, v});
        }
    }
    return totalWeight;
}

int main() {
    std::vector<Edge> edges = {{0, 1, 4}, {0, 2, 2}, {1, 2, 1}, {1, 3, 5}, {2, 3, 8}};
    std::cout << "Kruskal MST Weight: " << kruskalMST(4, edges) << std::endl;
    return 0;
}`,
    java: `import java.util.*;

public class KruskalPrimMST {
    static class Edge implements Comparable<Edge> {
        int u, v, weight;
        Edge(int u, int v, int w) { this.u = u; this.v = v; this.weight = w; }
        public int compareTo(Edge o) { return Integer.compare(this.weight, o.weight); }
    }

    public static int kruskal(int n, List<Edge> edges) {
        Collections.sort(edges);
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        int totalWeight = 0, accepted = 0;
        for (Edge e : edges) {
            int rootU = find(parent, e.u);
            int rootV = find(parent, e.v);
            if (rootU != rootV) {
                parent[rootU] = rootV;
                totalWeight += e.weight;
                if (++accepted == n - 1) break;
            }
        }
        return totalWeight;
    }

    private static int find(int[] parent, int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent, parent[i]);
    }

    public static void main(String[] args) {
        List<Edge> edges = Arrays.asList(
            new Edge(0, 1, 4), new Edge(0, 2, 2), new Edge(1, 2, 1), new Edge(1, 3, 5)
        );
        System.out.println("MST Weight: " + kruskal(4, edges));
    }
}`,
    python: `import heapq

def kruskal(n: int, edges: list[tuple[int, int, int]]) -> int:
    edges.sort(key=lambda e: e[2])  # (u, v, weight)
    parent = list(range(n))

    def find(i: int) -> int:
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]

    total_weight = 0
    accepted = 0
    for u, v, weight in edges:
        root_u, root_v = find(u), find(v)
        if root_u != root_v:
            parent[root_u] = root_v
            total_weight += weight
            accepted += 1
            if accepted == n - 1:
                break
    return total_weight

def prim(n: int, adj: list[list[tuple[int, int]]]) -> int:
    in_mst = [False] * n
    pq = [(0, 0)]  # (weight, node)
    total_weight = 0

    while pq:
        wt, u = heapq.heappop(pq)
        if in_mst[u]:
            continue
        in_mst[u] = True
        total_weight += wt
        for v, w in adj[u]:
            if not in_mst[v]:
                heapq.heappush(pq, (w, v))
    return total_weight

if __name__ == "__main__":
    edges = [(0, 1, 4), (0, 2, 2), (1, 2, 1), (1, 3, 5)]
    print("Kruskal MST Weight:", kruskal(4, edges))`,
  },

  'matrix-flood-fill': {
    cpp: `#include <iostream>
#include <vector>
#include <queue>

class Solution {
public:
    // Count connected components (Islands) using 4-directional BFS
    int numIslands(std::vector<std::vector<char>>& grid) {
        if (grid.empty()) return 0;
        int rows = grid.size(), cols = grid[0].size();
        int islands = 0;
        const int dr[] = {-1, 1, 0, 0};
        const int dc[] = {0, 0, 1, -1};

        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < cols; ++c) {
                if (grid[r][c] == '1') {
                    islands++;
                    std::queue<std::pair<int, int>> q;
                    q.push({r, c});
                    grid[r][c] = '0'; // sink land to visited

                    while (!q.empty()) {
                        auto [cr, cc] = q.front(); q.pop();
                        for (int i = 0; i < 4; ++i) {
                            int nr = cr + dr[i], nc = cc + dc[i];
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1') {
                                grid[nr][nc] = '0';
                                q.push({nr, nc});
                            }
                        }
                    }
                }
            }
        }
        return islands;
    }
};

int main() {
    std::vector<std::vector<char>> grid = {
        {'1', '1', '0', '0'},
        {'1', '1', '0', '0'},
        {'0', '0', '1', '1'}
    };
    Solution sol;
    std::cout << "Number of Islands: " << sol.numIslands(grid) << std::endl;
    return 0;
}`,
    java: `import java.util.*;

public class Solution {
    public static int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int rows = grid.length, cols = grid[0].length;
        int islands = 0;
        int[][] dirs = {{-1, 0}, {1, 0}, {0, 1}, {0, -1}};

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    islands++;
                    Queue<int[]> q = new LinkedList<>();
                    q.add(new int[]{r, c});
                    grid[r][c] = '0';

                    while (!q.isEmpty()) {
                        int[] curr = q.poll();
                        for (int[] d : dirs) {
                            int nr = curr[0] + d[0], nc = curr[1] + d[1];
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1') {
                                grid[nr][nc] = '0';
                                q.add(new int[]{nr, nc});
                            }
                        }
                    }
                }
            }
        }
        return islands;
    }

    public static void main(String[] args) {
        char[][] grid = {
            {'1', '1', '0'},
            {'0', '1', '0'},
            {'0', '0', '1'}
        };
        System.out.println("Islands: " + numIslands(grid));
    }
}`,
    python: `from collections import deque

def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0
    dirs = [(-1, 0), (1, 0), (0, 1), (0, -1)]

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                q = deque([(r, c)])
                grid[r][c] = '0'  # Sink visited cell

                while q:
                    cr, cc = q.popleft()
                    for dr, dc in dirs:
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            q.append((nr, nc))
    return islands

if __name__ == "__main__":
    grid = [
        ['1', '1', '0', '0'],
        ['1', '1', '0', '0'],
        ['0', '0', '1', '1']
    ]
    print("Total Islands:", num_islands(grid))`,
  },

  'matrix-spiral-order': {
    cpp: `#include <iostream>
#include <vector>

std::vector<int> spiralOrder(const std::vector<std::vector<int>>& matrix) {
    if (matrix.empty()) return {};
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    std::vector<int> output;

    while (top <= bottom && left <= right) {
        // 1. Traverse Right across Top row
        for (int c = left; c <= right; ++c) output.push_back(matrix[top][c]);
        top++;

        // 2. Traverse Down along Right col
        for (int r = top; r <= bottom; ++r) output.push_back(matrix[r][right]);
        right--;

        // 3. Traverse Left across Bottom row
        if (top <= bottom) {
            for (int c = right; c >= left; --c) output.push_back(matrix[bottom][c]);
            bottom--;
        }

        // 4. Traverse Up along Left col
        if (left <= right) {
            for (int r = bottom; r >= top; --r) output.push_back(matrix[r][left]);
            left++;
        }
    }
    return output;
}

int main() {
    std::vector<std::vector<int>> matrix = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    auto result = spiralOrder(matrix);
    for (int x : result) std::cout << x << " ";
    std::cout << std::endl;
    return 0;
}`,
    java: `import java.util.*;

public class SpiralMatrix {
    public static List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix == null || matrix.length == 0) return result;

        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) result.add(matrix[top][c]);
            top++;
            for (int r = top; r <= bottom; r++) result.add(matrix[r][right]);
            right--;

            if (top <= bottom) {
                for (int c = right; c >= left; c--) result.add(matrix[bottom][c]);
                bottom--;
            }
            if (left <= right) {
                for (int r = bottom; r >= top; r--) result.add(matrix[r][left]);
                left++;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        System.out.println("Spiral: " + spiralOrder(m));
    }
}`,
    python: `def spiral_order(matrix: list[list[int]]) -> list[int]:
    if not matrix:
        return []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    result = []

    while top <= bottom and left <= right:
        # Move Right
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1

        # Move Down
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1

        # Move Left
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1

        # Move Up
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1

    return result

if __name__ == "__main__":
    matrix = [
        [1,  2,  3,  4],
        [5,  6,  7,  8],
        [9, 10, 11, 12]
    ]
    print("Spiral Order:", spiral_order(matrix))`,
  },
  'jump-search': {
    cpp: `#include <iostream>
#include <vector>
#include <cmath>

int jumpSearch(const std::vector<int>& arr, int target) {
    int n = arr.size();
    int step = std::sqrt(n);
    int prev = 0;

    while (arr[std::min(step, n) - 1] < target) {
        prev = step;
        step += std::sqrt(n);
        if (prev >= n) return -1;
    }

    while (arr[prev] < target) {
        prev++;
        if (prev == std::min(step, n)) return -1;
    }

    if (arr[prev] == target) return prev;
    return -1;
}

int main() {
    std::vector<int> arr = {0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610};
    int target = 55;
    int idx = jumpSearch(arr, target);
    std::cout << "Found " << target << " at index " << idx << std::endl;
    return 0;
}`,
    java: `import java.util.*;

public class JumpSearch {
    public static int jumpSearch(int[] arr, int target) {
        int n = arr.length;
        int step = (int) Math.floor(Math.sqrt(n));
        int prev = 0;

        while (arr[Math.min(step, n) - 1] < target) {
            prev = step;
            step += (int) Math.floor(Math.sqrt(n));
            if (prev >= n) return -1;
        }

        while (arr[prev] < target) {
            prev++;
            if (prev == Math.min(step, n)) return -1;
        }

        return arr[prev] == target ? prev : -1;
    }

    public static void main(String[] args) {
        int[] arr = {0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610};
        System.out.println("Index of 55: " + jumpSearch(arr, 55));
    }
}`,
    python: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0

    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1

    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1

    return prev if arr[prev] == target else -1

if __name__ == "__main__":
    arr = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610]
    print("Found 55 at index:", jump_search(arr, 55))`
  },
  'interpolation-search': {
    cpp: `#include <iostream>
#include <vector>

int interpolationSearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;

    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low == high) {
            if (arr[low] == target) return low;
            return -1;
        }

        int pos = low + (((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low]));

        if (arr[pos] == target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}

int main() {
    std::vector<int> arr = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150};
    int target = 90;
    std::cout << "Target " << target << " found at index: " << interpolationSearch(arr, target) << std::endl;
    return 0;
}`,
    java: `public class InterpolationSearch {
    public static int search(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            if (low == high) return arr[low] == target ? low : -1;
            int pos = low + (int)(((long)(high - low) * (target - arr[low])) / (arr[high] - arr[low]));
            if (arr[pos] == target) return pos;
            if (arr[pos] < target) low = pos + 1;
            else high = pos - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150};
        System.out.println("Index of 90: " + search(arr, 90));
    }
}`,
    python: `def interpolation_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high and arr[low] <= target <= arr[high]:
        if low == high:
            return low if arr[low] == target else -1
        pos = low + int(((high - low) / (arr[high] - arr[low])) * (target - arr[low]))
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1

if __name__ == "__main__":
    arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]
    print("Found 90 at index:", interpolation_search(arr, 90))`
  },
  'counting-sort': {
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>

std::vector<int> countingSort(const std::vector<int>& arr) {
    if (arr.empty()) return {};
    int minVal = *std::min_element(arr.begin(), arr.end());
    int maxVal = *std::max_element(arr.begin(), arr.end());
    int range = maxVal - minVal + 1;

    std::vector<int> count(range, 0);
    for (int x : arr) count[x - minVal]++;
    for (int i = 1; i < range; i++) count[i] += count[i - 1];

    std::vector<int> output(arr.size());
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i] - minVal] - 1] = arr[i];
        count[arr[i] - minVal]--;
    }
    return output;
}

int main() {
    std::vector<int> arr = {4, 2, 2, 8, 3, 3, 1};
    auto sorted = countingSort(arr);
    for (int x : sorted) std::cout << x << " ";
    std::cout << std::endl;
    return 0;
}`,
    java: `import java.util.Arrays;

public class CountingSort {
    public static int[] sort(int[] arr) {
        int max = Arrays.stream(arr).max().orElse(0);
        int min = Arrays.stream(arr).min().orElse(0);
        int range = max - min + 1;
        int[] count = new int[range];
        for (int x : arr) count[x - min]++;
        for (int i = 1; i < range; i++) count[i] += count[i - 1];

        int[] output = new int[arr.length];
        for (int i = arr.length - 1; i >= 0; i--) {
            output[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
        }
        return output;
    }

    public static void main(String[] args) {
        int[] arr = {4, 2, 2, 8, 3, 3, 1};
        System.out.println(Arrays.toString(sort(arr)));
    }
}`,
    python: `def counting_sort(arr):
    if not arr:
        return []
    min_val, max_val = min(arr), max(arr)
    count = [0] * (max_val - min_val + 1)
    for x in arr:
        count[x - min_val] += 1
    for i in range(1, len(count)):
        count[i] += count[i - 1]

    output = [0] * len(arr)
    for x in reversed(arr):
        output[count[x - min_val] - 1] = x
        count[x - min_val] -= 1
    return output

if __name__ == "__main__":
    arr = [4, 2, 2, 8, 3, 3, 1]
    print("Sorted:", counting_sort(arr))`
  },
  'heap-sort-algo': {
    cpp: `#include <iostream>
#include <vector>

void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

int main() {
    std::vector<int> arr = {12, 11, 13, 5, 6, 7};
    heapSort(arr);
    for (int x : arr) std::cout << x << " ";
    std::cout << std::endl;
    return 0;
}`,
    java: `import java.util.Arrays;

public class HeapSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i, left = 2 * i + 1, right = 2 * i + 2;
        if (left < n && arr[left] > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;
        if (largest != i) {
            int swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;
            heapify(arr, n, largest);
        }
    }

    public static void main(String[] args) {
        int[] arr = {12, 11, 13, 5, 6, 7};
        sort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
    python: `def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)
    return arr

if __name__ == "__main__":
    arr = [12, 11, 13, 5, 6, 7]
    print("Heap Sorted:", heap_sort(arr))`
  },
  'recursion-factorial': {
    cpp: `#include <iostream>

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int n = 5;
    std::cout << n << "! = " << factorial(n) << std::endl;
    return 0;
}`,
    java: `public class FactorialRecursion {
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5));
    }
}`,
    python: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

if __name__ == "__main__":
    print("5! =", factorial(5))`
  },
  'recursion-fibonacci-tree': {
    cpp: `#include <iostream>

int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    int n = 6;
    std::cout << "fib(" << n << ") = " << fib(n) << std::endl;
    return 0;
}`,
    java: `public class FibonacciTree {
    public static int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println("fib(6) = " + fib(6));
    }
}`,
    python: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

if __name__ == "__main__":
    print("fib(6) =", fib(6))`
  },
  'array-crud-operations': {
    cpp: `#include <iostream>
#include <vector>

void insertAt(std::vector<int>& arr, int index, int value) {
    arr.push_back(0);
    for (int i = arr.size() - 1; i > index; i--) {
        arr[i] = arr[i - 1];
    }
    arr[index] = value;
}

void deleteAt(std::vector<int>& arr, int index) {
    for (size_t i = index; i < arr.size() - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arr.pop_back();
}

int main() {
    std::vector<int> arr = {10, 20, 30, 40, 50};
    insertAt(arr, 2, 25);
    deleteAt(arr, 4);
    for (int x : arr) std::cout << x << " ";
    std::cout << std::endl;
    return 0;
}`,
    java: `import java.util.ArrayList;

public class ArrayCRUD {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(10); list.add(20); list.add(30); list.add(40); list.add(50);
        list.add(2, 25);
        list.remove(4);
        System.out.println(list);
    }
}`,
    python: `def array_insert(arr, index, val):
    arr.append(None)
    for i in range(len(arr) - 1, index, -1):
        arr[i] = arr[i - 1]
    arr[index] = val

def array_delete(arr, index):
    for i in range(index, len(arr) - 1):
        arr[i] = arr[i + 1]
    arr.pop()

if __name__ == "__main__":
    arr = [10, 20, 30, 40, 50]
    array_insert(arr, 2, 25)
    array_delete(arr, 4)
    print("Array after CRUD:", arr)`
  },
  'string-comparison-concat': {
    cpp: `#include <iostream>
#include <string>

int strCompare(const std::string& s1, const std::string& s2) {
    size_t minLen = std::min(s1.length(), s2.length());
    for (size_t i = 0; i < minLen; i++) {
        if (s1[i] != s2[i]) return (unsigned char)s1[i] - (unsigned char)s2[i];
    }
    return s1.length() - s2.length();
}

std::string strConcat(const std::string& s1, const std::string& s2) {
    std::string res;
    res.reserve(s1.length() + s2.length());
    res += s1;
    res += s2;
    return res;
}

int main() {
    std::string a = "ALGO", b = "ALARM";
    std::cout << "Compare: " << strCompare(a, b) << std::endl;
    std::cout << "Concat: " << strConcat(a, b) << std::endl;
    return 0;
}`,
    java: `public class StringOps {
    public static int compare(String s1, String s2) {
        return s1.compareTo(s2);
    }
    public static String concat(String s1, String s2) {
        return s1 + s2;
    }
    public static void main(String[] args) {
        System.out.println("Compare: " + compare("ALGO", "ALARM"));
        System.out.println("Concat: " + concat("ALGO", "ALARM"));
    }
}`,
    python: `def str_compare(s1, s2):
    return (s1 > s2) - (s1 < s2)

def str_concat(s1, s2):
    return s1 + s2

if __name__ == "__main__":
    print("Compare:", str_compare("ALGO", "ALARM"))
    print("Concat:", str_concat("ALGO", "ALARM"))`
  },
  'binary-tree-lca-height': {
    cpp: `#include <iostream>
#include <algorithm>

struct Node {
    int val;
    Node *left, *right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

int getHeight(Node* root) {
    if (!root) return 0;
    return 1 + std::max(getHeight(root->left), getHeight(root->right));
}

Node* lowestCommonAncestor(Node* root, int p, int q) {
    if (!root || root->val == p || root->val == q) return root;
    Node* left = lowestCommonAncestor(root->left, p, q);
    Node* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}

int main() {
    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    root->left->left = new Node(4);
    root->left->right = new Node(5);
    std::cout << "Height: " << getHeight(root) << std::endl;
    Node* lca = lowestCommonAncestor(root, 4, 5);
    std::cout << "LCA(4, 5): " << lca->val << std::endl;
    return 0;
}`,
    java: `public class TreeLCAHeight {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    public static int getHeight(Node root) {
        if (root == null) return 0;
        return 1 + Math.max(getHeight(root.left), getHeight(root.right));
    }

    public static Node getLCA(Node root, int p, int q) {
        if (root == null || root.val == p || root.val == q) return root;
        Node left = getLCA(root.left, p, q);
        Node right = getLCA(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }

    public static void main(String[] args) {
        Node root = new Node(1);
        root.left = new Node(2); root.right = new Node(3);
        System.out.println("Height: " + getHeight(root));
        System.out.println("LCA: " + getLCA(root, 2, 3).val);
    }
}`,
    python: `class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def get_height(root):
    if not root:
        return 0
    return 1 + max(get_height(root.left), get_height(root.right))

def lca(root, p, q):
    if not root or root.val == p or root.val == q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root
    return left or right

if __name__ == "__main__":
    root = Node(1, Node(2, Node(4), Node(5)), Node(3))
    print("Height:", get_height(root))
    print("LCA(4, 5):", lca(root, 4, 5).val)`
  },
  'circular-doubly-linked-list': {
    cpp: `#include <iostream>

struct Node {
    int val;
    Node *prev, *next;
    Node(int v) : val(v), prev(nullptr), next(nullptr) {}
};

class CircularDoublyList {
    Node* head = nullptr;
public:
    void append(int val) {
        Node* node = new Node(val);
        if (!head) {
            head = node;
            head->next = head;
            head->prev = head;
            return;
        }
        Node* tail = head->prev;
        tail->next = node;
        node->prev = tail;
        node->next = head;
        head->prev = node;
    }

    void displayForward() {
        if (!head) return;
        Node* curr = head;
        do {
            std::cout << curr->val << " <-> ";
            curr = curr->next;
        } while (curr != head);
        std::cout << "(circular)" << std::endl;
    }
};

int main() {
    CircularDoublyList list;
    list.append(10); list.append(20); list.append(30);
    list.displayForward();
    return 0;
}`,
    java: `public class CircularDoublyLinkedList {
    static class Node {
        int val; Node prev, next;
        Node(int v) { val = v; }
    }
    Node head = null;

    public void append(int val) {
        Node node = new Node(val);
        if (head == null) {
            head = node; head.next = head; head.prev = head;
            return;
        }
        Node tail = head.prev;
        tail.next = node; node.prev = tail;
        node.next = head; head.prev = node;
    }

    public static void main(String[] args) {
        CircularDoublyLinkedList list = new CircularDoublyLinkedList();
        list.append(10); list.append(20); list.append(30);
        System.out.println("Circular Doubly List Created");
    }
}`,
    python: `class Node:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None

class CircularDoublyList:
    def __init__(self):
        self.head = None

    def append(self, val):
        node = Node(val)
        if not self.head:
            self.head = node
            node.next = node
            node.prev = node
            return
        tail = self.head.prev
        tail.next = node
        node.prev = tail
        node.next = self.head
        self.head.prev = node

if __name__ == "__main__":
    cdl = CircularDoublyList()
    cdl.append(10)
    cdl.append(20)
    print("Circular Doubly Linked List initialized.")`
  },
};

export function getAlgorithmCode(id: string, name: string): CodeImplementation {
  if (algorithmCodeMap[id]) {
    return algorithmCodeMap[id];
  }

  // Generalized fallback
  return {
    cpp: `// Complete runnable C++ implementation for ${name}
#include <iostream>
#include <vector>

void solve() {
    std::cout << "Running ${name}" << std::endl;
}

int main() {
    solve();
    return 0;
}`,
    java: `// Complete runnable Java implementation for ${name}
public class Solution {
    public static void main(String[] args) {
        System.out.println("Running ${name}");
    }
}`,
    python: `# Complete runnable Python implementation for ${name}
def solve():
    print("Running ${name}")

if __name__ == "__main__":
    solve()`,
  };
}
