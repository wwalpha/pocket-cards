//
//  HistoriesViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//
//

import SwiftUI

class HistoriesViewModel: ObservableObject {
    @Published var histories: [History] = []
}
