//
//  WeeklyChoiceView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

struct Item {
    var isChecked: Bool
    var name: String

    init(_ name: String) {
        isChecked = false
        self.name = name
    }
}

struct WeeklyChoiceView: View {
    var interactor: WeeklyChoiceBusinessLogic?
    var router: WeeklyChoiceRouter = .init()

    @ObservedObject var viewModel = WeeklyChoiceViewModel()
    @State var selection = Set<String>()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                Text("Loading....")
            } else if !viewModel.isConfirmed {
                VStack {
                    CheckList(datas: viewModel.checkList(), selection: $selection)

                    Spacer()

                    Button {
                        interactor?.validation(selected: viewModel.selectedRows(selection: selection))
                    } label: {
                        Text("確定")
                            .font(.system(size: 24, design: .default))
                            .fontWeight(.bold)
                            .frame(width: 200, height: 48, alignment: .center)
                            .background(Color.primaryDarkColor)
                            .foregroundColor(Color.white)
                    }
                    .padding(.trailing, 32)
                    .clipped()
                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                }.padding()
            } else if viewModel.isConfirmed {
                if viewModel.mode == MODE.WEEKLY_ABILITY {
                    router.makeTest(selected: viewModel.selectedRows(selection: selection))
                }
                if viewModel.mode == MODE.WEEKLY_PRACTICE {
                    router.makePractice(groupIds: selection)
                }
            }
        }.onDisappear {
            viewModel.isConfirmed = false
            self.selection = Set<String>()
        }
    }
}

extension WeeklyChoiceView: WeeklyChoiceDisplayLogic {
    func validation(result _: Bool) {
        viewModel.isConfirmed = true
    }

    func showGroups(model: WeeklyChoiceViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
        }

        viewModel.dataRows = model.dataRows
    }
}

extension WeeklyChoiceView {
    func configureView(subject: String, mode: String) -> some View {
        var view = self
        let interactor = WeeklyChoiceInteractor()
        let presenter = WeeklyChoicePresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.subject = subject
        view.viewModel.mode = mode
        view.viewModel.isLoading = true

        interactor.loadGroups(subject: subject)

        return view
    }
}

struct WeeklyChoiceView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyChoiceView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
